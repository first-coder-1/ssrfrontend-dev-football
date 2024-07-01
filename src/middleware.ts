import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest) {
  const shouldHandleLocale = !PUBLIC_FILE.test(req.nextUrl.pathname) && req.nextUrl.locale === "_catch";

  if (shouldHandleLocale) {
    const url = req.nextUrl.clone();
    const locale = req.cookies.get("NEXT_LOCALE")?.value || "en";
    url.pathname = `/${locale}${req.nextUrl.pathname}`;
    return NextResponse.redirect(url);
  }

  return undefined;
}
