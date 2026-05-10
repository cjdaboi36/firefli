import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/utils/database"
import { withPublicApiRateLimit } from "@/utils/prtl"
import { validateApiKey } from "@/utils/api-auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed" })

  const apiKey = req.headers.authorization?.replace("Bearer ", "")
  if (!apiKey) return res.status(401).json({ success: false, error: "Missing API key" })

  const workspaceId = Number.parseInt(req.query.id as string)
  if (!workspaceId) return res.status(400).json({ success: false, error: "Missing workspace ID" })

  const caseId = req.query.caseId as string
  if (!caseId) return res.status(400).json({ success: false, error: "Missing case ID" })

  try {
    const key = await validateApiKey(apiKey, workspaceId)
    if (!key) return res.status(401).json({ success: false, error: "Invalid or expired API key" })

    const { revokedByUserId, reason } = req.body

    if (!revokedByUserId || typeof reason !== "string" || !reason.trim()) {
      return res.status(400).json({ success: false, error: "revokedByUserId and reason are required" })
    }

    const revokedById = Number(revokedByUserId)
    if (!Number.isInteger(revokedById) || revokedById <= 0) {
      return res.status(400).json({ success: false, error: "Invalid revokedByUserId" })
    }

    const existingCase = await prisma.moderationCase.findFirst({
      where: {
        id: caseId,
        workspaceGroupId: BigInt(workspaceId),
      },
    })

    if (!existingCase) {
      return res.status(404).json({ success: false, error: "Case not found" })
    }
    if (existingCase.revokedAt) {
      return res.status(400).json({ success: false, error: "Case has already been revoked" })
    }
    if (!existingCase.action) {
      return res.status(400).json({ success: false, error: "Case has no action to revoke" })
    }

    // Ensure revoker user exists
    await prisma.user.upsert({
      where: { userid: BigInt(revokedById) },
      update: {},
      create: { userid: BigInt(revokedById) },
    })

    const updatedCase = await prisma.moderationCase.update({
      where: { id: caseId },
      data: {
        revokedAt: new Date(),
        revokedBy: BigInt(revokedById),
        revokeReason: reason.trim(),
      },
    })

    await prisma.moderationLog.create({
      data: {
        workspaceGroupId: BigInt(workspaceId),
        actionBy: BigInt(revokedById),
        action: "case_revoked_via_api",
        targetUser: existingCase.targetUserId,
        targetUsername: existingCase.targetUsername ?? null,
        caseId,
        details: { revokeReason: reason.trim() },
      },
    })

    return res.status(200).json({
      success: true,
      data: {
        id: updatedCase.id,
        revokedAt: updatedCase.revokedAt,
        revokedBy: Number(updatedCase.revokedBy),
        revokeReason: updatedCase.revokeReason,
      },
    })
  } catch (error) {
    console.error("Error revoking moderation case via public API:", error)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }
}

export default withPublicApiRateLimit(handler)
