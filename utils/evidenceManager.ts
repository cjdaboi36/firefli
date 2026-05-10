import fs from "fs";
import path from "path";
import { fileTypeFromBuffer } from "file-type";

const EVIDENCE_DIR = path.join(process.cwd(), "evidence");
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
];

export interface EvidenceUploadResult {
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export function ensureEvidenceDir(): void {
  if (!fs.existsSync(EVIDENCE_DIR)) {
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  }
}

export function ensureCaseDir(caseId: string): string {
  const caseDir = path.join(EVIDENCE_DIR, caseId);
  if (!fs.existsSync(caseDir)) {
    fs.mkdirSync(caseDir, { recursive: true });
  }
  return caseDir;
}

export async function validateFileBuffer(
  buffer: Buffer
): Promise<{ valid: boolean; fileType?: string; error?: string }> {
  if (buffer.length > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }
  const type = await fileTypeFromBuffer(buffer);
  if (!type || !ALLOWED_MIME_TYPES.includes(type.mime)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
    };
  }
  return { valid: true, fileType: type.mime };
}

export async function saveEvidenceFile(
  caseId: string,
  fileName: string,
  buffer: Buffer
): Promise<EvidenceUploadResult> {
  const validation = await validateFileBuffer(buffer);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  ensureEvidenceDir();
  const caseDir = ensureCaseDir(caseId);
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const timestamp = Date.now();
  const uniqueFileName = `${timestamp}-${sanitizedFileName}`;
  const filePath = path.join(caseDir, uniqueFileName);
  fs.writeFileSync(filePath, buffer);

  return {
    fileUrl: `/api/evidence/${caseId}/${uniqueFileName}`,
    fileName: sanitizedFileName,
    fileType: validation.fileType!,
    fileSize: buffer.length,
  };
}

export function deleteEvidenceFile(fileUrl: string): boolean {
  try {
    const urlParts = fileUrl.split("/");
    const caseId = urlParts[urlParts.length - 2];
    const fileName = urlParts[urlParts.length - 1];
    const filePath = path.join(EVIDENCE_DIR, caseId, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting evidence file:", error);
    return false;
  }
}

export function deleteCaseEvidence(caseId: string): boolean {
  try {
    const caseDir = path.join(EVIDENCE_DIR, caseId);
    if (fs.existsSync(caseDir)) {
      fs.rmSync(caseDir, { recursive: true, force: true });
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting case evidence:", error);
    return false;
  }
}

export function getExtensionFromMimeType(mimeType: string): string {
  const mimeMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "video/mp4": "mp4",
    "video/webm": "webm",
  };
  return mimeMap[mimeType] || "bin";
}

export function getEvidenceFilePath(caseId: string, fileName: string): string | null {
  try {
    const filePath = path.join(EVIDENCE_DIR, caseId, fileName);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
    return null;
  } catch (error) {
    console.error("Error getting evidence file path:", error);
    return null;
  }
}

export function parseBase64File(base64Data: string): Buffer {
  const base64String = base64Data.includes(",")
    ? base64Data.split(",")[1]
    : base64Data;
  return Buffer.from(base64String, "base64");
}
