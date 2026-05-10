import { NextApiRequest, NextApiResponse } from "next";
import { withPermissionCheck } from "@/utils/permissionsManager";
import prisma from "@/utils/database";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id: workspaceId, banId } = req.query;
  const groupId = BigInt(workspaceId as string);

  if (req.method === "DELETE") {
    try {
      const ban = await prisma.playerBan.findFirst({
        where: {
          id: banId as string,
          workspaceGroupId: groupId,
        },
      });

      if (!ban) {
        return res.status(404).json({
          success: false,
          error: "Ban not found",
        });
      }

      const updatedBan = await prisma.playerBan.update({
        where: {
          id: banId as string,
        },
        data: {
          active: false,
          unbannedAt: new Date(),
          unbannedById: req.session.userid!,
        },
      });

      await prisma.moderationLog.create({
        data: {
          workspaceGroupId: groupId,
          actionBy: req.session.userid!,
          action: "ban_removed",
          targetUser: ban.userId,
          details: {
            banId: ban.id,
            originalReason: ban.reason,
            originalBanDate: ban.createdAt,
          },
        },
      });

      return res.status(200).json({
        success: true,
        data: updatedBan,
        message: "User unbanned successfully",
      });
    } catch (error) {
      console.error("Error removing ban:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to remove ban",
      });
    }
  }

  if (req.method === "GET") {
    try {
      const ban = await prisma.playerBan.findFirst({
        where: {
          id: banId as string,
          workspaceGroupId: groupId,
        },
      });

      if (!ban) {
        return res.status(404).json({
          success: false,
          error: "Ban not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: ban,
      });
    } catch (error) {
      console.error("Error fetching ban:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch ban",
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: "Method not allowed",
  });
}

export default withPermissionCheck(handler, ["execute_bans"]);
