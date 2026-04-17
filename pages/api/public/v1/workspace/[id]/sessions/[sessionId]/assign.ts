import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/database";
import { validateApiKey } from "@/utils/api-auth";
import { withPublicApiRateLimit } from "@/utils/prtl";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST" && req.method !== "PATCH") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  const apiKey = req.headers.authorization?.replace("Bearer ", "");
  if (!apiKey) {
    return res.status(401).json({ success: false, error: "Missing API key" });
  }

  const workspaceId = Number.parseInt(req.query.id as string);
  const sessionId = req.query.sessionId as string;

  if (!workspaceId) {
    return res
      .status(400)
      .json({ success: false, error: "Missing workspace ID" });
  }

  if (!sessionId) {
    return res
      .status(400)
      .json({ success: false, error: "Missing session ID" });
  }

  const { userId, roleId, slot, action } = req.body;

  try {
    const key = await validateApiKey(apiKey, workspaceId);
    if (!key) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid or expired API key" });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        sessionType: {
          include: {
            workspace: {
              select: {
                groupId: true,
              },
            },
          },
        },
      },
    });

    if (!session) {
      return res
        .status(404)
        .json({ success: false, error: "Session not found" });
    }

    if (session.sessionType.workspace.groupId !== BigInt(workspaceId)) {
      return res.status(403).json({
        success: false,
        error: "Session does not belong to this workspace",
      });
    }

    if (action && userId && roleId !== undefined && slot !== undefined) {
      const userIdBigInt = BigInt(userId);
      if (action === "assign") {
        const existingAssignment = await prisma.sessionUser.findUnique({
          where: {
            userid_sessionid_roleID_slot: {
              userid: userIdBigInt,
              sessionid: sessionId,
              roleID: roleId,
              slot: slot,
            },
          },
        });

        if (existingAssignment) {
          return res.status(400).json({
            success: false,
            error: "User already assigned to this slot",
          });
        }

        await prisma.sessionUser.create({
          data: {
            userid: userIdBigInt,
            sessionid: sessionId,
            roleID: roleId,
            slot: slot,
          },
        });

        await prisma.sessionLog.create({
          data: {
            sessionId: sessionId,
            actorId: key.createdById,
            targetId: userIdBigInt,
            action: "role_assigned",
            metadata: {
              roleId: roleId,
              slot: slot,
              createdVia: "public_api",
            },
          },
        });
      } else if (action === "unassign") {
        await prisma.sessionUser.deleteMany({
          where: {
            userid: userIdBigInt,
            sessionid: sessionId,
            roleID: roleId,
            slot: slot,
          },
        });

        await prisma.sessionLog.create({
          data: {
            sessionId: sessionId,
            actorId: key.createdById,
            targetId: userIdBigInt,
            action: "role_unassigned",
            metadata: {
              roleId: roleId,
              slot: slot,
              createdVia: "public_api",
            },
          },
        });
      } else {
        return res.status(400).json({
          success: false,
          error: "Invalid action. Must be 'assign' or 'unassign'",
        });
      }
    }

    const updatedSession = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        users: {
          include: {
            user: {
              select: {
                userid: true,
                username: true,
                displayName: true,
                picture: true,
              },
            },
          },
        },
        sessionType: true,
      },
    });

    const sessionSlots = (updatedSession!.sessionType.slots as any[]) || [];
    const allAssigned = updatedSession!.users.map((su) => {
      const matchingSlot = sessionSlots.find((s: any) => s.id === su.roleID);
      return {
        userId: su.userid.toString(),
        username: su.user.username,
        displayName: su.user.displayName,
        picture: su.user.picture,
        roleId: su.roleID,
        roleName: matchingSlot?.name || null,
        hostRole: matchingSlot?.hostRole || null,
        slot: su.slot,
        weight: matchingSlot?.weight ?? 0,
        categoryId: matchingSlot?.categoryId || null,
        categoryName: matchingSlot?.categoryName || null,
        categoryWeight: matchingSlot?.categoryWeight ?? 0,
      };
    });

    const primaryHost =
      allAssigned.find((p) => p.hostRole === "primary" && p.slot === 0) ||
      allAssigned.find((p) => p.hostRole === "primary") ||
      null;
    const secondaryHosts = allAssigned.filter((p) => p.hostRole === "secondary");
    const participants = allAssigned.filter((p) => !p.hostRole);

    return res.status(200).json({
      success: true,
      message: "Session updated successfully",
      session: {
        id: updatedSession!.id,
        name: updatedSession!.name,
        date: updatedSession!.date,
        primaryHost: primaryHost
          ? {
              userId: primaryHost.userId,
              username: primaryHost.username,
              displayName: primaryHost.displayName,
              picture: primaryHost.picture,
              roleId: primaryHost.roleId,
              slot: primaryHost.slot,
            }
          : null,
        secondaryHosts: secondaryHosts.map((p) => ({
          userId: p.userId,
          username: p.username,
          displayName: p.displayName,
          picture: p.picture,
          roleId: p.roleId,
          slot: p.slot,
        })),
        participants: participants.map((p) => ({
          userId: p.userId,
          username: p.username,
          displayName: p.displayName,
          picture: p.picture,
          roleId: p.roleId,
          roleName: p.roleName,
          slot: p.slot,
          weight: p.weight,
          categoryId: p.categoryId,
          categoryName: p.categoryName,
          categoryWeight: p.categoryWeight,
        })),
      },
    });
  } catch (error) {
    console.error("Error updating session assignments:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
}

export default withPublicApiRateLimit(handler);
