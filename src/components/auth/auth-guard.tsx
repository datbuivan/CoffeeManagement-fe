"use client";

import { useAuth } from "@/context/authContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRoles?: string[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * AuthGuard component to protect routes
 * 
 * @example
 * // Protect a page that requires authentication
 * <AuthGuard requireAuth>
 *   <YourProtectedPage />
 * </AuthGuard>
 * 
 * @example
 * // Protect a page that requires specific roles
 * <AuthGuard requireAuth requiredRoles={["admin", "moderator"]}>
 *   <AdminPage />
 * </AuthGuard>
 * 
 * @example
 * // Redirect authenticated users (for login/register pages)
 * <AuthGuard requireAuth={false} redirectTo="/">
 *   <LoginPage />
 * </AuthGuard>
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  requiredRoles = [],
  redirectTo,
  fallback = null,
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !isAuthenticated) {
      const loginUrl = redirectTo || `/login?redirect=${encodeURIComponent(pathname)}`;
      router.push(loginUrl);
      return;
    }

    if (!requireAuth && isAuthenticated) {
      router.push(redirectTo || "/");
      return;
    }

    // Check role requirements
    if (requireAuth && isAuthenticated && requiredRoles.length > 0) {
      const userRole = user?.roleName; // chỉ có roleName
      const hasRequiredRole = requiredRoles.includes(userRole || "");
    
      if (!hasRequiredRole) {
        router.push(redirectTo || "/unauthorized");
        return;
      }
    }
  }, [
    loading,
    isAuthenticated,
    requireAuth,
    requiredRoles,
    user,
    router,
    pathname,
    redirectTo,
  ]);

  if (loading) {
    return <>{fallback}</>;
  }

  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>;
  }

  if (!requireAuth && isAuthenticated) {
    return <>{fallback}</>;
  }

  if (requireAuth && isAuthenticated && requiredRoles.length > 0) {
    const userRole = user?.roleName;
    const hasRequiredRole = requiredRoles.includes(userRole || "");

    if (!hasRequiredRole) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

export const useHasRole = (roles: string | string[]): boolean => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return false;

  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  const userRole = user.roleName; // chỉ có 1 role

  return requiredRoles.includes(userRole);
};


export const useHasAllRoles = (roles: string[]): boolean => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return false;

  const userRole = user.roleName; // chỉ có 1 role

  // Chỉ true khi role duy nhất của user nằm trong roles
  return roles.length === 1 && roles[0] === userRole;
};


interface RoleGuardProps {
  children: React.ReactNode;
  roles: string | string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  roles,
  requireAll = false,
  fallback = null,
}) => {
  const hasRole = useHasRole(roles);
  const hasAllRoles = useHasAllRoles(Array.isArray(roles) ? roles : [roles]);

  const shouldRender = requireAll ? hasAllRoles : hasRole;

  return shouldRender ? <>{children}</> : <>{fallback}</>;
};