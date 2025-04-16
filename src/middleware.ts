import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  debug: true, // 👈 shows middleware info in console
  publicRoutes: ['/', '/sign-in(.*)', '/sign-up(.*)']
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*|favicon.ico).*)']
};
