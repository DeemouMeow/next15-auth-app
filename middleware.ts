import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {
    default as allRoutes,
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicRoutes
} from "@/lib/routes";


const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req) {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = Object.values(publicRoutes).includes(nextUrl.pathname);
    const isAuthRoute = !isPublicRoute && Object.values(authRoutes).includes(nextUrl.pathname);

    if (isApiAuthRoute)
        return null;

    if (isAuthRoute) {
        if (isLoggedIn)
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));

        return null;
    }

    if (!isPublicRoute && !isLoggedIn)
        return Response.redirect(new URL(allRoutes.login, nextUrl));

    return null;
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};