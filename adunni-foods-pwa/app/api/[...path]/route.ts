import { NextResponse, type NextRequest } from "next/server"
import { revalidatePath } from "next/cache"

export const runtime = "nodejs"

const DEFAULT_BACKEND_API = "http://127.0.0.1:5000/api"

function backendUrl(req: NextRequest, pathSegments: string[]) {
  const base = process.env.BACKEND_API_URL ?? DEFAULT_BACKEND_API
  const baseNormalized = base.endsWith("/") ? base.slice(0, -1) : base
  const path = pathSegments.map(encodeURIComponent).join("/")
  const url = new URL(`${baseNormalized}/${path}`)
  url.search = req.nextUrl.search
  return url.toString()
}

function cachePolicyFor(pathname: string) {
  // Keep the app fast while staying reasonably fresh.
  if (pathname.startsWith("/products")) return { revalidate: 60, tag: "products" }
  if (pathname.startsWith("/reviews")) return { revalidate: 60, tag: "reviews" }
  if (pathname.startsWith("/settings/store")) return { revalidate: 300, tag: "store-settings" }
  if (pathname.startsWith("/orders")) return { revalidate: 0 as const, tag: "orders" }
  if (pathname.startsWith("/notifications")) return { revalidate: 0 as const, tag: "notifications" }
  return { revalidate: 0 as const, tag: "api" }
}

async function proxy(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params
  const pathname = `/${path.join("/")}`
  const url = backendUrl(req, path)

  const method = req.method.toUpperCase()
  const isRead = method === "GET" || method === "HEAD"

  const incomingAuth = req.headers.get("authorization")
  const incomingContentType = req.headers.get("content-type")

  const headers: HeadersInit = {}
  if (incomingAuth) headers["authorization"] = incomingAuth
  if (incomingContentType) headers["content-type"] = incomingContentType

  const body =
    isRead || method === "HEAD" ? undefined : await req.arrayBuffer()

  const policy = cachePolicyFor(pathname)

  let backendRes: Response
  try {
    backendRes = await fetch(url, {
      method,
      headers,
      body,
      cache: isRead ? "force-cache" : "no-store",
      next: isRead && policy.revalidate > 0 ? { revalidate: policy.revalidate, tags: [policy.tag] } : undefined,
    })
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Upstream API is unreachable. Start the backend server or set BACKEND_API_URL to a reachable API base.",
      },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    )
  }

  // Mutations are always no-store. Read caching is handled via `next.revalidate` above.
  // Purge paths if a mutation was successful to ensure instant UI updates across the app.
  if (!isRead && backendRes.ok) {
    if (pathname.startsWith("/products")) revalidatePath("/", "layout")
    if (pathname.startsWith("/reviews")) revalidatePath("/", "layout")
    if (pathname.startsWith("/settings/store")) revalidatePath("/", "layout")
    if (pathname.startsWith("/orders")) revalidatePath("/", "layout")
    if (pathname.startsWith("/notifications")) revalidatePath("/", "layout")
  }

  const resHeaders = new Headers(backendRes.headers)
  // Ensure browser/proxy caching is safe and snappy.
  if (isRead && policy.revalidate > 0) {
    resHeaders.set("Cache-Control", `public, max-age=0, s-maxage=${policy.revalidate}, stale-while-revalidate=300`)
  } else {
    resHeaders.set("Cache-Control", "no-store")
  }

  return new NextResponse(backendRes.body, {
    status: backendRes.status,
    statusText: backendRes.statusText,
    headers: resHeaders,
  })
}

export function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx)
}
export function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx)
}
export function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx)
}
export function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx)
}
export function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx)
}
