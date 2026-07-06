import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const protectedAdminRoutes = [
  '/hm-admin/dashboard',
  '/hm-admin/stories',
  '/hm-admin/categories',
];

function isProtectedAdminRoute(pathname: string) {
  return protectedAdminRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = isProtectedAdminRoute(pathname);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (isProtected) {
      return NextResponse.redirect(new URL('/hm-admin', request.url));
    }

    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: '', ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value: '', ...options });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;

  if (user) {
    const { data } = await supabase.rpc('is_admin');
    isAdmin = data === true;
  }

  if (pathname === '/hm-admin' && isAdmin) {
    return NextResponse.redirect(new URL('/hm-admin/dashboard', request.url));
  }

  if (isProtected && !isAdmin) {
    return NextResponse.redirect(new URL('/hm-admin', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/hm-admin/:path*'],
};
