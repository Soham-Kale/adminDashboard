/**
 * Server-side helper for calling the real YouInSports backend.
 * Only used inside Next.js API routes (never in client components).
 * The JWT token stays server-side — never exposed to the browser.
 */

const BACKEND_URL = process.env.BACKEND_API_URL ?? "";
const BACKEND_JWT = process.env.BACKEND_JWT_TOKEN ?? "";

export async function backendGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${BACKEND_JWT}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 }, // Next.js fetch cache: 60 s
  });

  if (!res.ok) {
    let detail = "";
    try {
      const body = await res.json() as Record<string, unknown>;
      detail = (body?.message ?? body?.error ?? "") as string;
    } catch { /* body not JSON */ }
    throw new Error(`Backend GET ${path} → HTTP ${res.status}${detail ? `: ${detail}` : ""}`);
  }
  return res.json() as Promise<T>;
}

export async function backendPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${BACKEND_JWT}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let detail = "";
    try {
      const errBody = await res.json() as Record<string, unknown>;
      detail = (errBody?.message ?? errBody?.error ?? "") as string;
    } catch { /* body not JSON */ }
    throw new Error(`Backend POST ${path} → HTTP ${res.status}${detail ? `: ${detail}` : ""}`);
  }
  return res.json() as Promise<T>;
}
