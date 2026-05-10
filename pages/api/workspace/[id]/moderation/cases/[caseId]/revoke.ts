import { NextApiRequest, NextApiResponse } from "next";
import { withPermissionCheck } from "@/utils/permissionsManager";
import prisma from "@/utils/database";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  const { id: workspaceId, caseId } = req.query;
  const groupId = BigInt(workspaceId as string);
  const { reason } = req.body;

  if (!reason || !reason.trim()) {
    return res.status(400).json({
      success: false,
      error: "Revocation reason is required",
    });
  }

  try {
    const existingCase = await prisma.moderationCase.findFirst({
      where: {
        id: caseId as string,
        workspaceGroupId: groupId,
      },
    });

    if (!existingCase) {
      return res.status(404).json({
        success: false,
        error: "Case not found",
      });
    }

    if (existingCase.revokedAt) {
      return res.status(400).json({
        success: false,
        error: "Case action has already been revoked",
      });
    }

    if (!existingCase.action) {
      return res.status(400).json({
        success: false,
        error: "Case has no action to revoke",
      });
    }

    const updatedCase = await prisma.moderationCase.update({
      where: {
        id: caseId as string,
      },
      data: {
        revokedAt: new Date(),
        revokedBy: req.session.userid!,
        revokeReason: reason,
      },
      include: {
        targetUser: {
          select: {
            userid: true,
            username: true,
            picture: true,
          },
        },
        revokedByUser: {
          select: {
            userid: true,
            username: true,
            picture: true,
          },
        },
      },
    });

    await prisma.moderationLog.create({
      data: {
        workspaceGroupId: groupId,
        actionBy: req.session.userid!,
        action: "case_revoked",
        targetUser: existingCase.targetUserId,
        targetUsername: existingCase.targetUsername,
        caseId: caseId as string,
        details: {
          action: existingCase.action,
          reason: reason,
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedCase,
    });
  } catch (error) {
    console.error("Error revoking case:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to revoke case action",
    });
  }
}

export default withPermissionCheck(handler, ["revoke_punishments"]);
