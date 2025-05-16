import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routeAccessMap } from "./lib/settings";

export default authMiddleware({
  publicRoutes: ["/"],
  afterAuth(auth, req) {
    const { userId, sessionClaims } = auth;
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    console.log("Current route:", req.nextUrl.pathname);
    console.log("User role:", role);

    // Check if the current route is in the routeAccessMap
    for (const [route, allowedRoles] of Object.entries(routeAccessMap)) {
      if (new RegExp(`^${route}$`).test(req.nextUrl.pathname)) {
        console.log("Matching route:", route);
        console.log("Allowed roles:", allowedRoles);
        
        if (!allowedRoles.includes(role as string)) {
          console.log("Access denied, redirecting to dashboard");
          return NextResponse.redirect(new URL("/", req.url));
        }
      }
    }

    // If we get here, allow the request to proceed
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
