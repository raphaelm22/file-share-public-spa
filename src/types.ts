export interface ShareInfo {
  fileName: string
  fileSize: number
  expiresAt: string | null  // ISO 8601 UTC, null = TTL infinito
  createdAt: string         // ISO 8601 UTC
}
