// constants/permissions.ts
export const PERMISSION_CODES = {
  // Workspace
  WORKSPACE_READ: "workspace:read",
  WORKSPACE_UPDATE: "workspace:update",
  WORKSPACE_DELETE: "workspace:delete",
  WORKSPACE_MANAGE_BILLING: "workspace:manage_billing",
  WORKSPACE_EXPORT_DATA: "workspace:export_data",

  // Member Management
  MEMBER_CREATE: "member:create",
  MEMBER_UPDATE: "member:update",
  MEMBER_READ: "member:read",
  MEMBER_REMOVE: "member:remove",
  MEMBER_UPDATE_ROLE: "member:update_role",

  // Role Management
  ROLE_CREATE: "role:create",
  ROLE_READ: "role:read",
  ROLE_UPDATE: "role:update",
  ROLE_DELETE: "role:delete",

  // Project
  PROJECT_CREATE: "project:create",
  PROJECT_READ: "project:read",
  PROJECT_UPDATE: "project:update",
  PROJECT_DELETE: "project:delete",
  PROJECT_ARCHIVE: "project:archive",

  // Task
  TASK_CREATE: "task:create",
  TASK_READ: "task:read",
  TASK_UPDATE: "task:update",
  TASK_DELETE: "task:delete",
  TASK_ASSIGN: "task:assign",
  TASK_CHANGE_STATUS: "task:change_status",

  // Comment
  COMMENT_CREATE: "comment:create",
  COMMENT_READ: "comment:read",
  COMMENT_UPDATE: "comment:update",
  COMMENT_DELETE_OWN: "comment:delete_own",
  COMMENT_DELETE_ANY: "comment:delete_any",

  // Label
  LABEL_CREATE: "label:create",
  LABEL_READ: "label:read",
  LABEL_UPDATE: "label:update",
  LABEL_DELETE: "label:delete",

  // File
  FILE_UPLOAD: "file:upload",
  FILE_READ: "file:read",
  FILE_DELETE: "file:delete",

  // Settings
  SETTINGS_READ: "settings:read",
  SETTINGS_UPDATE: "settings:update",

  // Analytics
  ANALYTICS_VIEW: "analytics:view",
} as const;

export type PermissionCode =
  (typeof PERMISSION_CODES)[keyof typeof PERMISSION_CODES];

// All available permission codes as mutable array
export const ALL_PERMISSIONS: PermissionCode[] = [
  PERMISSION_CODES.WORKSPACE_READ,
  PERMISSION_CODES.WORKSPACE_UPDATE,
  PERMISSION_CODES.WORKSPACE_DELETE,
  PERMISSION_CODES.WORKSPACE_MANAGE_BILLING,
  PERMISSION_CODES.WORKSPACE_EXPORT_DATA,
  PERMISSION_CODES.MEMBER_CREATE,
  PERMISSION_CODES.MEMBER_READ,
  PERMISSION_CODES.MEMBER_UPDATE,
  PERMISSION_CODES.MEMBER_REMOVE,
  PERMISSION_CODES.MEMBER_UPDATE_ROLE,
  PERMISSION_CODES.ROLE_CREATE,
  PERMISSION_CODES.ROLE_READ,
  PERMISSION_CODES.ROLE_UPDATE,
  PERMISSION_CODES.ROLE_DELETE,
  PERMISSION_CODES.PROJECT_CREATE,
  PERMISSION_CODES.PROJECT_READ,
  PERMISSION_CODES.PROJECT_UPDATE,
  PERMISSION_CODES.PROJECT_DELETE,
  PERMISSION_CODES.PROJECT_ARCHIVE,
  PERMISSION_CODES.TASK_CREATE,
  PERMISSION_CODES.TASK_READ,
  PERMISSION_CODES.TASK_UPDATE,
  PERMISSION_CODES.TASK_DELETE,
  PERMISSION_CODES.TASK_ASSIGN,
  PERMISSION_CODES.TASK_CHANGE_STATUS,
  PERMISSION_CODES.COMMENT_CREATE,
  PERMISSION_CODES.COMMENT_READ,
  PERMISSION_CODES.COMMENT_UPDATE,
  PERMISSION_CODES.COMMENT_DELETE_OWN,
  PERMISSION_CODES.COMMENT_DELETE_ANY,
  PERMISSION_CODES.LABEL_CREATE,
  PERMISSION_CODES.LABEL_READ,
  PERMISSION_CODES.LABEL_UPDATE,
  PERMISSION_CODES.LABEL_DELETE,
  PERMISSION_CODES.FILE_UPLOAD,
  PERMISSION_CODES.FILE_READ,
  PERMISSION_CODES.FILE_DELETE,
  PERMISSION_CODES.SETTINGS_READ,
  PERMISSION_CODES.SETTINGS_UPDATE,
  PERMISSION_CODES.ANALYTICS_VIEW,
];

// Default role configurations per workspace
export const DEFAULT_WORKSPACE_ROLES = {
  OWNER: {
    name: "OWNER" as const,
    description: "Full access to all workspace features and settings.",
    permissions: ALL_PERMISSIONS,
  },
  ADMIN: {
    name: "ADMIN" as const,
    description: "Manage workspace settings and members.",
    permissions: ALL_PERMISSIONS,
  },
  MEMBER: {
    name: "MEMBER" as const,
    description: "Standard contributor with basic access.",
    permissions: ALL_PERMISSIONS,
  },
  VIEWER: {
    name: "VIEWER" as const,
    description: "Read-only access to workspace content.",
    permissions: ALL_PERMISSIONS,
  },
};

export type WorkspaceRoleName = keyof typeof DEFAULT_WORKSPACE_ROLES;
