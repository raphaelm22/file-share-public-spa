import type { ShareInfo } from './types'

const API_BASE = import.meta.env.VITE_API_BASE ?? ''

export async function getShareInfo(token: string, signal?: AbortSignal): Promise<ShareInfo> {
  const res = await fetch(`${API_BASE}/dl/${token}`, { signal })
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { detail?: string }
    throw new Error(body.detail ?? 'UNKNOWN_ERROR')
  }
  return res.json() as Promise<ShareInfo>
}

export function getDownloadFileUrl(token: string): string {
  return `${API_BASE}/dl/${token}/file`
}
