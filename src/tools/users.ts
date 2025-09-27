import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getRequest, patchRequest, removeKeys } from "../utils.js";
const registerUserTools = (server: McpServer) => {
  server.tool(
    "get_users",
    "Get Users from clockify",
    {
      email: z.string().optional(),
      "project-id": z.string().optional(),
      name: z.string().optional(),
      "sort-column": z
        .enum([
          "ID",
          "EMAIL",
          "NAME",
          "NAME_LOWERCASE",
          "ACCESS",
          "HOURLYRATE",
          "COSTRATE",
        ])
        .optional(),
      "sort-order": z.enum(["ASCENDING", "DESCENDING"]).optional(),
      page: z.string().optional(),
      "page-size": z.string().optional(),
      status: z
        .enum(["PENDING", "ACTIVE", "DECLINED", "INACTIVE", "ALL"])
        .optional(),
      "include-roles": z.boolean(),
    },
    async (params) => {
      const users = await getRequest("/users", params);
      return {
        content: [{ type: "text", text: JSON.stringify(users, null, 2) }],
      };
    }
  );

  server.tool(
    "get_member_profile",
    "Get User Member Profile from clockify",
    {
      userId: z.string().optional(),
    },
    async (params) => {
      const user = await getRequest(`/member-profile/${params.userId}`);
      return {
        content: [{ type: "text", text: JSON.stringify(user, null, 2) }],
      };
    }
  );

  server.tool(
    "update_member_profile",
    "Update User Member Profile from clockify",
    {
      userId: z.string(),
      imageUrl: z.string().optional(),
      removeProfileImage: z.boolean().optional(),
      weekStart: z
        .enum([
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
          "SUNDAY",
        ])
        .optional(),
      workingDays: z
        .enum([
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
          "SUNDAY",
        ])
        .optional(),
      workCapacity: z.string().optional(),
    },
    async (body) => {
      const user = await patchRequest(
        `/member-profile/${body.userId}`,
        removeKeys(body, "userId")
      );
      return {
        content: [{ type: "text", text: JSON.stringify(user, null, 2) }],
      };
    }
  );
};

export default registerUserTools;
