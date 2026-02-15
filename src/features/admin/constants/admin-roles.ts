export const adminRoles = ["super_admin", "admin", "content_manager", "viewer"] as const
export type AdminRole = (typeof adminRoles)[number]
