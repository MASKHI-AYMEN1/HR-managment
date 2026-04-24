// Permission utility functions

export const MODULE_PATHS: { [path: string]: string } = {
  '/admin/dashboard': 'dashboard',
  '/admin/users': 'users',
  '/admin/offers': 'offers',
  '/admin/diagnostic': 'offers', // diagnostic is part of offers
  '/admin/evaluations': 'evaluations',
  '/admin/interviews': 'interviews',
  '/admin/profiles': 'profiles',
  '/admin/calendar': 'dashboard', // calendar might be part of dashboard
  '/admin/packages': 'dashboard',
};

export const hasPermission = (
  userPermissions: { [module: string]: string } | undefined,
  modulePath: string,
  requiredLevel: 'read' | 'write' | 'admin' = 'read'
): boolean => {
  if (!userPermissions) return true; // If no permissions set, allow all (for backward compatibility)

  const module = MODULE_PATHS[modulePath];
  if (!module) return true; // If module not in map, allow by default

  const userLevel = userPermissions[module];
  if (!userLevel) return false; // If user has no permission for this module, deny

  // Permission hierarchy: admin > write > read
  const levels = { read: 1, write: 2, admin: 3 };
  return levels[userLevel as keyof typeof levels] >= levels[requiredLevel];
};

export const filterMenuItemsByPermissions = <T extends { href: string }>(
  menuItems: T[],
  userPermissions: { [module: string]: string } | undefined
): T[] => {
  if (!userPermissions) return menuItems; // If no permissions set, show all
  
  return menuItems.filter((item) => hasPermission(userPermissions, item.href, 'read'));
};
