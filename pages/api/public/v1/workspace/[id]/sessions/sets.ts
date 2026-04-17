import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/database";
import { validateApiKey } from "@/utils/api-auth";
import { withPublicApiRateLimit } from "@/utils/prtl";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  const apiKey = req.headers.authorization?.replace("Bearer ", "");
  if (!apiKey) {
    return res.status(401).json({ success: false, error: "Missing API key" });
  }

  const workspaceId = Number.parseInt(req.query.id as string);
  if (!workspaceId) {
    return res
      .status(400)
      .json({ success: false, error: "Missing workspace ID" });
  }

  try {
    const key = await validateApiKey(apiKey, workspaceId);
    if (!key) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid or expired API key" });
    }

    const roleSets = await prisma.sessionRoleTemplate.findMany({
      where: { workspaceGroupId: workspaceId, archived: false },
      include: { category: true },
      orderBy: [{ weight: "asc" }, { createdAt: "asc" }],
    });

    return res.status(200).json({
      success: true,
      roleSets: roleSets.map((r) => ({
        id: r.id,
        name: r.name,
        hostRole: r.hostRole ?? null,
        slots: r.slots,
        weight: r.weight,
        groupRoles: r.groupRoles,
        category: r.category
          ? {
              id: r.category.id,
              name: r.category.name,
              weight: r.category.weight,
            }
          : null,
      })),
    });
  } catch (error) {
    console.error("Error fetching session role sets:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
}

export default withPublicApiRateLimit(handler);
