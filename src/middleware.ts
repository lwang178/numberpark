import { authMiddleware } from '@clerk/nextjs/server';

export default authMiddleware({
  publicRoutes: ['/', '/sign-in(.*)', '/sign-up(.*)', '/api(.*)']
});

export const config = {
  matcher: ['/((?!_next|.*\\..*|favicon.ico).*)']
};
