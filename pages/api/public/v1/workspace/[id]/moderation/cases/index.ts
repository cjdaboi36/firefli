import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/utils/database"
import { withPublicApiRateLimit } from "@/utils/prtl"
import { validateApiKey } from "@/utils/api-auth"

const VALID_STATUSES = ["open", "resolved", "appealed", "archived"]
const VALID_ACTIONS = ["warning", "kick", "temp_ban", "perm_ban"]

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed" })

  const apiKey = req.headers.authorization?.replace("Bearer ", "")
  if (!apiKey) return res.status(401).json({ success: false, error: "Missing API key" })

  const workspaceId = Number.parseInt(req.query.id as string)
  if (!workspaceId) return res.status(400).json({ success: false, error: "Missing workspace ID" })

  try {
    const key = await validateApiKey(apiKey, workspaceId)
    if (!key) return res.status(401).json({ success: false, error: "Invalid or expired API key" })

    const {
      targetUserId,
      targetUsername,
      authorUserId,
      reason,
      description,
      status = "open",
      action,
      publicNote,
      banDuration,
      expiresAt,
    } = req.body

    if (!targetUserId || !authorUserId || !reason) {
      return res.status(400).json({
        success: false,
        error: "targetUserId, authorUserId, and reason are required",
      })
    }

    const targetId = Number(targetUserId)
    const authorId = Number(authorUserId)

    if (!Number.isInteger(targetId) || targetId <= 0) {
      return res.status(400).json({ success: false, error: "Invalid targetUserId" })
    }
    if (!Number.isInteger(authorId) || authorId <= 0) {
      return res.status(400).json({ success: false, error: "Invalid authorUserId" })
    }
    if (typeof reason !== "string" || !reason.trim()) {
      return res.status(400).json({ success: false, error: "reason must be a non-empty string" })
    }
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, error: `status must be one of: ${VALID_STATUSES.join(", ")}` })
    }
    if (action && !VALID_ACTIONS.includes(action)) {
      return res.status(400).json({ success: false, error: `action must be one of: ${VALID_ACTIONS.join(", ")}` })
    }

    if (action === "temp_ban" && !expiresAt) {
      return res.status(400).json({ success: false, error: "expiresAt is required for temporary bans" })
    }

    const finalIsPermanent = action === "perm_ban"
    let parsedExpiresAt: Date | null = null
    if (action === "temp_ban" && expiresAt) {
      parsedExpiresAt = new Date(expiresAt)
      if (isNaN(parsedExpiresAt.getTime())) {
        return res.status(400).json({ success: false, error: "Invalid expiresAt date" })
      }
    }

    // Ensure target and author users exist (they may be Roblox users not yet in the system)
    await Promise.all([
      prisma.user.upsert({
        where: { userid: BigInt(targetId) },
        update: targetUsername ? { username: String(targetUsername) } : {},
        create: { userid: BigInt(targetId), username: targetUsername ? String(targetUsername) : null },
      }),
      prisma.user.upsert({
        where: { userid: BigInt(authorId) },
        update: {},
        create: { userid: BigInt(authorId) },
      }),
    ])

    const moderationCase = await prisma.moderationCase.create({
      data: {
        workspaceGroupId: BigInt(workspaceId),
        targetUserId: BigInt(targetId),
        targetUsername: targetUsername ? String(targetUsername) : null,
        createdBy: BigInt(authorId),
        reason: reason.trim(),
        description: description ? String(description) : null,
        status,
        action: action ?? null,
        publicNote: publicNote ? String(publicNote) : null,
        banDuration: banDuration != null ? Number(banDuration) : null,
        isPermanent: finalIsPermanent,
        expiresAt: parsedExpiresAt,
      },
    })

    await prisma.moderationLog.create({
      data: {
        workspaceGroupId: BigInt(workspaceId),
        actionBy: BigInt(authorId),
        action: "case_created_via_api",
        targetUser: BigInt(targetId),
        targetUsername: targetUsername ? String(targetUsername) : null,
        caseId: moderationCase.id,
        details: { reason: reason.trim(), status, action: action ?? null },
      },
    })

    return res.status(201).json({
      success: true,
      data: {
        id: moderationCase.id,
        targetUserId: Number(moderationCase.targetUserId),
        targetUsername: moderationCase.targetUsername,
        authorUserId: Number(moderationCase.createdBy),
        reason: moderationCase.reason,
        description: moderationCase.description,
        status: moderationCase.status,
        action: moderationCase.action,
        publicNote: moderationCase.publicNote,
        banDuration: moderationCase.banDuration,
        isPermanent: moderationCase.isPermanent,
        expiresAt: moderationCase.expiresAt,
        createdAt: moderationCase.createdAt,
      },
    })
  } catch (error) {
    console.error("Error creating moderation case via public API:", error)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }
}

export default withPublicApiRateLimit(handler)
