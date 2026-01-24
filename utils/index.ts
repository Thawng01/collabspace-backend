// Seed this data into your Permission table
export const PERMISSIONS_TO_SEED = [
  // ========== WORKSPACE CATEGORY ==========
  {
    code: "workspace:read",
    name: "View Workspace",
    description: "Can view workspace details and settings",
    category: "Workspace",
  },
  {
    code: "workspace:update",
    name: "Edit Workspace",
    description: "Can edit workspace name, description, and settings",
    category: "Workspace",
  },
  {
    code: "workspace:delete",
    name: "Delete Workspace",
    description: "Can permanently delete the workspace",
    category: "Workspace",
  },
  {
    code: "workspace:manage_billing",
    name: "Manage Billing",
    description: "Can update billing information and subscription",
    category: "Workspace",
  },
  {
    code: "workspace:export_data",
    name: "Export Data",
    description: "Can export workspace data",
    category: "Workspace",
  },

  // ========== MEMBER MANAGEMENT CATEGORY ==========
  {
    code: "member:invite",
    name: "Invite Members",
    description: "Can invite new members to the workspace",
    category: "Member Management",
  },
  {
    code: "member:remove",
    name: "Remove Members",
    description: "Can remove members from the workspace",
    category: "Member Management",
  },
  {
    code: "member:update_role",
    name: "Update Member Roles",
    description: "Can change roles of existing members",
    category: "Member Management",
  },

  // ========== ROLE MANAGEMENT CATEGORY ==========
  {
    code: "role:create",
    name: "Create Roles",
    description: "Can create new custom roles",
    category: "Role Management",
  },
  {
    code: "role:read",
    name: "View Roles",
    description: "Can view all roles and their permissions",
    category: "Role Management",
  },
  {
    code: "role:update",
    name: "Edit Roles",
    description: "Can modify existing roles and their permissions",
    category: "Role Management",
  },
  {
    code: "role:delete",
    name: "Delete Roles",
    description: "Can delete custom roles",
    category: "Role Management",
  },

  // ========== PROJECT CATEGORY ==========
  {
    code: "project:create",
    name: "Create Projects",
    description: "Can create new projects",
    category: "Project",
  },
  {
    code: "project:read",
    name: "View Projects",
    description: "Can view all projects in workspace",
    category: "Project",
  },
  {
    code: "project:update",
    name: "Edit Projects",
    description: "Can edit project details, settings, and status",
    category: "Project",
  },
  {
    code: "project:delete",
    name: "Delete Projects",
    description: "Can delete projects permanently",
    category: "Project",
  },
  {
    code: "project:archive",
    name: "Archive Projects",
    description: "Can archive and unarchive projects",
    category: "Project",
  },

  // ========== TASK CATEGORY ==========
  {
    code: "task:create",
    name: "Create Tasks",
    description: "Can create new tasks",
    category: "Task",
  },
  {
    code: "task:read",
    name: "View Tasks",
    description: "Can view all tasks in projects",
    category: "Task",
  },
  {
    code: "task:update",
    name: "Edit Tasks",
    description: "Can edit task details, assignees, and status",
    category: "Task",
  },
  {
    code: "task:delete",
    name: "Delete Tasks",
    description: "Can delete tasks permanently",
    category: "Task",
  },
  {
    code: "task:assign",
    name: "Assign Tasks",
    description: "Can assign tasks to members",
    category: "Task",
  },
  {
    code: "task:change_status",
    name: "Change Task Status",
    description: "Can move tasks between columns/statuses",
    category: "Task",
  },

  // ========== COMMENT CATEGORY ==========
  {
    code: "comment:create",
    name: "Create Comments",
    description: "Can add comments to tasks and projects",
    category: "Comment",
  },
  {
    code: "comment:read",
    name: "View Comments",
    description: "Can view all comments",
    category: "Comment",
  },
  {
    code: "comment:update",
    name: "Edit Comments",
    description: "Can edit own comments",
    category: "Comment",
  },
  {
    code: "comment:delete_own",
    name: "Delete Own Comments",
    description: "Can delete comments created by self",
    category: "Comment",
  },
  {
    code: "comment:delete_any",
    name: "Delete Any Comments",
    description: "Can delete any comment in workspace",
    category: "Comment",
  },

  // ========== LABEL CATEGORY ==========
  {
    code: "label:create",
    name: "Create Labels",
    description: "Can create new labels/tags",
    category: "Label",
  },
  {
    code: "label:read",
    name: "View Labels",
    description: "Can view all labels",
    category: "Label",
  },
  {
    code: "label:update",
    name: "Edit Labels",
    description: "Can edit label names and colors",
    category: "Label",
  },
  {
    code: "label:delete",
    name: "Delete Labels",
    description: "Can delete labels",
    category: "Label",
  },

  // ========== FILE CATEGORY ==========
  {
    code: "file:upload",
    name: "Upload Files",
    description: "Can upload attachments to tasks and projects",
    category: "File",
  },
  {
    code: "file:read",
    name: "View Files",
    description: "Can view and download files",
    category: "File",
  },
  {
    code: "file:delete",
    name: "Delete Files",
    description: "Can delete uploaded files",
    category: "File",
  },

  // ========== SETTINGS CATEGORY ==========
  {
    code: "settings:read",
    name: "View Settings",
    description: "Can view workspace settings",
    category: "Settings",
  },
  {
    code: "settings:update",
    name: "Update Settings",
    description: "Can modify workspace settings",
    category: "Settings",
  },

  // ========== ANALYTICS CATEGORY ==========
  {
    code: "analytics:view",
    name: "View Analytics",
    description: "Can view workspace analytics and reports",
    category: "Analytics",
  },
];

export const DEFAULT_ROLE_TEMPLATES = {
  // System role - automatically assigned to workspace owner
  OWNER: {
    name: "Owner",
    description:
      "Full access to everything. Automatically assigned to workspace creator.",
    isSystem: true,
    permissions: "ALL", // Special keyword meaning all permissions
  },

  // Workspace-specific default roles
  ADMINISTRATOR: {
    name: "Administrator",
    description:
      "Full access except deleting workspace. Can manage members and roles.",
    isSystem: false,
    permissions: [
      // Workspace
      "workspace:read",
      "workspace:update",
      "workspace:manage_billing",
      "workspace:export_data",

      // Member Management
      "member:invite",
      "member:remove",
      "member:update_role",

      // Role Management
      "role:create",
      "role:read",
      "role:update",
      "role:delete",

      // Project
      "project:create",
      "project:read",
      "project:update",
      "project:delete",
      "project:archive",

      // Task
      "task:create",
      "task:read",
      "task:update",
      "task:delete",
      "task:assign",
      "task:change_status",

      // Comment
      "comment:create",
      "comment:read",
      "comment:update",
      "comment:delete_own",
      "comment:delete_any",

      // Label
      "label:create",
      "label:read",
      "label:update",
      "label:delete",

      // File
      "file:upload",
      "file:read",
      "file:delete",

      // Settings
      "settings:read",
      "settings:update",

      // Analytics
      "analytics:view",
    ],
  },

  MEMBER: {
    name: "Member",
    description:
      "Can create and edit content, but cannot manage workspace settings.",
    isSystem: false,
    permissions: [
      // Workspace
      "workspace:read",

      // Project
      "project:create",
      "project:read",
      "project:update",

      // Task
      "task:create",
      "task:read",
      "task:update",
      "task:assign",
      "task:change_status",

      // Comment
      "comment:create",
      "comment:read",
      "comment:update",
      "comment:delete_own",

      // Label
      "label:read",

      // File
      "file:upload",
      "file:read",
      "file:delete",

      // Settings
      "settings:read",
    ],
  },

  VIEWER: {
    name: "Viewer",
    description: "Can only view content, cannot make changes.",
    isSystem: false,
    permissions: [
      // Workspace
      "workspace:read",

      // Project
      "project:read",

      // Task
      "task:read",

      // Comment
      "comment:read",

      // Label
      "label:read",

      // File
      "file:read",

      // Settings
      "settings:read",
    ],
  },
};
