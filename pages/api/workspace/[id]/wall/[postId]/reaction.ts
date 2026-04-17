import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/database";
import { withPermissionCheck } from "@/utils/permissionsManager";
import { logAudit } from "@/utils/logs";

type Data = {
  success: boolean;
  error?: string;
  reaction?: {
    emoji: string;
    reacted: boolean;
    count: number;
  };
};

export default withPermissionCheck(handler, "react_wall");

export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const workspaceGroupId = Number(req.query.id);
  const postId = Number(req.query.postId);
  const userId = req.session.userid;
  const emojiRaw = req.body?.emoji;
  const emoji = typeof emojiRaw === "string" ? emojiRaw.trim() : "";

  if (!Number.isFinite(workspaceGroupId) || !Number.isFinite(postId) || !userId) {
    return res.status(400).json({ success: false, error: "Invalid request" });
  }

  if (!emoji || emoji.length > 6) {
    return res.status(400).json({ success: false, error: "Invalid emoji" });
  }

  const post = await prisma.wallPost.findUnique({
    where: { id: postId },
    select: { id: true, workspaceGroupId: true },
  });

  if (!post || Number(post.workspaceGroupId) !== workspaceGroupId) {
    return res.status(404).json({ success: false, error: "Post not found" });
  }

  const existingReaction = await prisma.wallPostReaction.findUnique({
    where: {
      wallPostId_userId: {
        wallPostId: postId,
        userId: BigInt(userId),
      },
    },
    select: { id: true, emoji: true },
  });

  let reacted = true;

  if (existingReaction) {
    if (existingReaction.emoji === emoji) {
      await prisma.wallPostReaction.delete({
        where: { id: existingReaction.id },
      });
      reacted = false;
    } else {
      await prisma.wallPostReaction.update({
        where: { id: existingReaction.id },
        data: { emoji },
      });
    }
  } else {
    await prisma.wallPostReaction.create({
      data: {
        wallPostId: postId,
        userId: BigInt(userId),
        emoji,
      },
    });
  }

  const count = await prisma.wallPostReaction.count({
    where: {
      wallPostId: postId,
      emoji,
    },
  });

  logAudit(workspaceGroupId, Number(userId), "wall.post.react", `wallpost:${postId}`, {
    postId,
    emoji,
    action: reacted ? "added" : "removed",
  }).catch(() => {});

  return res.status(200).json({
    success: true,
    reaction: {
      emoji,
      reacted,
      count,
    },
  });
}
