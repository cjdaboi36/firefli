/*
  Warnings:

  - The primary key for the `DepartmentMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `rank` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `workspace` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `workspaceMember` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "ActivityAdjustment" DROP CONSTRAINT "ActivityAdjustment_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "ActivityHistory" DROP CONSTRAINT "ActivityHistory_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "ActivityReset" DROP CONSTRAINT "ActivityReset_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "ActivitySession" DROP CONSTRAINT "ActivitySession_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "AdminMessageLog" DROP CONSTRAINT "AdminMessageLog_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "Ally" DROP CONSTRAINT "Ally_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "BloxlinkIntegration" DROP CONSTRAINT "BloxlinkIntegration_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "DepartmentMember" DROP CONSTRAINT "DepartmentMember_workspaceGroupId_userId_fkey";

-- DropForeignKey
ALTER TABLE "DiscordIntegration" DROP CONSTRAINT "DiscordIntegration_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "GameServer" DROP CONSTRAINT "GameServer_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerBan" DROP CONSTRAINT "PlayerBan_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerReport" DROP CONSTRAINT "PlayerReport_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "PolicyShareableLink" DROP CONSTRAINT "PolicyShareableLink_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "Quota" DROP CONSTRAINT "Quota_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "Recommendation" DROP CONSTRAINT "Recommendation_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "RemoteCommand" DROP CONSTRAINT "RemoteCommand_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "SavedView" DROP CONSTRAINT "SavedView_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "SessionRoleCategory" DROP CONSTRAINT "SessionRoleCategory_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "SessionRoleTemplate" DROP CONSTRAINT "SessionRoleTemplate_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "SessionTag" DROP CONSTRAINT "SessionTag_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "SessionType" DROP CONSTRAINT "SessionType_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "StickyAnnouncement" DROP CONSTRAINT "StickyAnnouncement_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "UserQuotaCompletion" DROP CONSTRAINT "UserQuotaCompletion_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "apiKey" DROP CONSTRAINT "apiKey_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "config" DROP CONSTRAINT "config_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "department" DROP CONSTRAINT "department_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "document" DROP CONSTRAINT "document_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "inactivityNotice" DROP CONSTRAINT "inactivityNotice_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "rank" DROP CONSTRAINT "rank_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "role" DROP CONSTRAINT "role_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "userBook" DROP CONSTRAINT "userBook_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "wallPost" DROP CONSTRAINT "wallPost_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "workspaceExternalServices" DROP CONSTRAINT "workspaceExternalServices_workspaceGroupId_fkey";

-- DropForeignKey
ALTER TABLE "workspaceMember" DROP CONSTRAINT "workspaceMember_workspaceGroupId_fkey";

-- AlterTable
ALTER TABLE "ActivityAdjustment" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "ActivityHistory" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "ActivityReset" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "ActivitySession" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "AdminMessageLog" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "Ally" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "AuditLog" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "BloxlinkIntegration" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "DepartmentMember" DROP CONSTRAINT "DepartmentMember_pkey",
ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT,
ADD CONSTRAINT "DepartmentMember_pkey" PRIMARY KEY ("departmentId", "workspaceGroupId", "userId");

-- AlterTable
ALTER TABLE "DiscordIntegration" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "GameServer" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "PlayerBan" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "PlayerReport" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "PolicyShareableLink" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "Quota" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "Recommendation" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "RemoteCommand" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "SavedView" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "SessionRoleCategory" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "SessionRoleTemplate" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "SessionTag" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "SessionType" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "StickyAnnouncement" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "UserQuotaCompletion" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "apiKey" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "config" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "department" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "document" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "inactivityNotice" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "rank" DROP CONSTRAINT "rank_pkey",
ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT,
ADD CONSTRAINT "rank_pkey" PRIMARY KEY ("userId", "workspaceGroupId");

-- AlterTable
ALTER TABLE "role" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "userBook" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "wallPost" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "workspace" DROP CONSTRAINT "workspace_pkey",
ALTER COLUMN "groupId" SET DATA TYPE BIGINT,
ADD CONSTRAINT "workspace_pkey" PRIMARY KEY ("groupId");

-- AlterTable
ALTER TABLE "workspaceExternalServices" ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "workspaceMember" DROP CONSTRAINT "workspaceMember_pkey",
ALTER COLUMN "workspaceGroupId" SET DATA TYPE BIGINT,
ADD CONSTRAINT "workspaceMember_pkey" PRIMARY KEY ("workspaceGroupId", "userId");

-- AddForeignKey
ALTER TABLE "config" ADD CONSTRAINT "config_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role" ADD CONSTRAINT "role_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentMember" ADD CONSTRAINT "DepartmentMember_workspaceGroupId_userId_fkey" FOREIGN KEY ("workspaceGroupId", "userId") REFERENCES "workspaceMember"("workspaceGroupId", "userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallPost" ADD CONSTRAINT "wallPost_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StickyAnnouncement" ADD CONSTRAINT "StickyAnnouncement_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionType" ADD CONSTRAINT "SessionType_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionRoleTemplate" ADD CONSTRAINT "SessionRoleTemplate_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionRoleCategory" ADD CONSTRAINT "SessionRoleCategory_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionTag" ADD CONSTRAINT "SessionTag_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivitySession" ADD CONSTRAINT "ActivitySession_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apiKey" ADD CONSTRAINT "apiKey_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inactivityNotice" ADD CONSTRAINT "inactivityNotice_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userBook" ADD CONSTRAINT "userBook_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rank" ADD CONSTRAINT "rank_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quota" ADD CONSTRAINT "Quota_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuotaCompletion" ADD CONSTRAINT "UserQuotaCompletion_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ally" ADD CONSTRAINT "Ally_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspaceMember" ADD CONSTRAINT "workspaceMember_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityAdjustment" ADD CONSTRAINT "ActivityAdjustment_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityHistory" ADD CONSTRAINT "ActivityHistory_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityReset" ADD CONSTRAINT "ActivityReset_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspaceExternalServices" ADD CONSTRAINT "workspaceExternalServices_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedView" ADD CONSTRAINT "SavedView_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PolicyShareableLink" ADD CONSTRAINT "PolicyShareableLink_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordIntegration" ADD CONSTRAINT "DiscordIntegration_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloxlinkIntegration" ADD CONSTRAINT "BloxlinkIntegration_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameServer" ADD CONSTRAINT "GameServer_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RemoteCommand" ADD CONSTRAINT "RemoteCommand_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerBan" ADD CONSTRAINT "PlayerBan_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerReport" ADD CONSTRAINT "PlayerReport_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminMessageLog" ADD CONSTRAINT "AdminMessageLog_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;
