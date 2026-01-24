// // utils/permission.utils.ts
// import {
//   Permission,
//   PermissionWithLabel,
//   PermissionGroup,
//   PermissionGroups,
// } from "../types/permission.types";

// types/permission.types.ts
export type Permission = {
  id: string;
  permission: string;
  createdAt: string;
  roleId: string;
};

export type PermissionWithLabel = Permission & {
  label: string;
};

export type PermissionGroup = {
  category: string;
  permissions: PermissionWithLabel[];
};

export type PermissionGroups = Record<string, PermissionWithLabel[]>;

const getPermissionCategory = (permissionCode: string): string => {
  const [category] = permissionCode.split(":");

  const categoryMap: Record<string, string> = {
    workspace: "Workspace",
    member: "Member Management",
    role: "Role Management",
    project: "Project",
    task: "Task",
    comment: "Comment",
    label: "Label",
    file: "File",
    settings: "Settings",
    analytics: "Analytics",
  };

  return (
    categoryMap[category] ||
    category.charAt(0).toUpperCase() + category.slice(1)
  );
};

const getPermissionLabel = (permissionCode: string): string => {
  const [category, action] = permissionCode.split(":");

  const actionLabels: Record<string, string> = {
    read: "View",
    create: "Create",
    update: "Update",
    delete: "Delete",
    remove: "Remove",
    assign: "Assign",
    archive: "Archive",
    upload: "Upload",
    view: "View",
    change_status: "Change Status",
    manage_billing: "Manage Billing",
    export_data: "Export Data",
    update_role: "Update Role",
    delete_own: "Delete Own",
    delete_any: "Delete Any",
  };

  const categoryLabels: Record<string, string> = {
    workspace: "Workspace",
    member: "Members",
    role: "Roles",
    project: "Projects",
    task: "Tasks",
    comment: "Comments",
    label: "Labels",
    file: "Files",
    settings: "Settings",
    analytics: "Analytics",
  };

  const readableAction = actionLabels[action] || action;
  const readableCategory = categoryLabels[category] || category;

  return `${readableAction} ${readableCategory}`;
};

export const groupPermissionsByCategory = (
  permissions: Permission[],
): PermissionGroup[] => {
  const grouped: Record<string, PermissionWithLabel[]> = {};

  permissions.forEach((permission) => {
    const category = getPermissionCategory(permission.permission);
    const label = getPermissionLabel(permission.permission);

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push({
      ...permission,
      label,
    });
  });

  // Convert to array format
  return Object.entries(grouped).map(([category, permissions]) => ({
    category,
    permissions,
  }));
};

export const groupPermissionsByCategoryAsObject = (
  permissions: Permission[],
): PermissionGroups => {
  const grouped: PermissionGroups = {};

  // Define category order
  const categoryOrder = [
    "Workspace",
    "Member Management",
    "Role Management",
    "Project",
    "Task",
    "Comment",
    "Label",
    "File",
    "Settings",
    "Analytics",
  ];

  // Initialize all categories
  categoryOrder.forEach((category) => {
    grouped[category] = [];
  });

  // Group permissions
  permissions.forEach((permission) => {
    const category = getPermissionCategory(permission.permission);
    const label = getPermissionLabel(permission.permission);

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push({
      ...permission,
      label,
    });
  });

  // Remove empty categories
  Object.keys(grouped).forEach((category) => {
    if (grouped[category].length === 0) {
      delete grouped[category];
    }
  });

  return grouped;
};
