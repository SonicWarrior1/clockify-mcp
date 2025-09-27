import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
  removeKeys,
} from "../utils.js";
import { costRate, hourlyRate } from "../types.js";

const registerProjectTools = (server: McpServer) => {
  server.tool(
    "get_projects",
    "Get Projects from clockify",
    {
      name: z.string().optional(),
      archived: z.boolean().optional(),
      billable: z.boolean().optional(),
      users: z.array(z.string()).optional(),
      clients: z.array(z.string()).optional(),
      page: z.string().optional(),
      "page-size": z.string().optional(),
      "sort-column": z
        .enum(["ID", "NAME", "CLIENT_NAME", "DURATION", "BUDGET", "PROGRESS"])
        .optional(),
      "sort-order": z.enum(["ASCENDING", "DESCENDING"]).optional(),
      access: z.enum(["PUBLIC", "PRIVATE"]).optional(),
    },
    async (params) => {
      const projects = await getRequest("/projects", params);
      return {
        content: [{ type: "text", text: JSON.stringify(projects, null, 2) }],
      };
    }
  );

  server.tool(
    "get_project_by_id",
    "Get Project by ID from clockify",
    {
      projectId: z.string(),
    },
    async (params) => {
      const project = await getRequest(`/projects/${params.projectId}`, {
        hydrated: true,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(project, null, 2) }],
      };
    }
  );

  server.tool(
    "add_project",
    "Add Project to clockify",
    {
      billable: z.boolean().optional(),
      clientId: z.string().optional(),
      color: z.string().optional(),
      name: z.string(),
      note: z.string().optional(),
      isPublic: z.boolean().optional(),
      hourlyRate: hourlyRate.optional(),
      estimate: z
        .object({
          type: z.enum(["AUTO", "MANUAL"]).optional(),
          estimate: z
            .object({
              nano: z.string().optional(),
              seconds: z.string().optional(),
              negative: z.boolean().optional(),
              positive: z.boolean().optional(),
              zero: z.boolean().optional(),
              units: z
                .array(
                  z.object({
                    dateBased: z.boolean().optional(),
                    durationEstimated: z.boolean().optional(),
                    timeBased: z.boolean().optional(),
                    duration: z
                      .object({
                        nano: z.string().optional(),
                        seconds: z.string().optional(),
                        negative: z.boolean().optional(),
                        positive: z.boolean().optional(),
                        zero: z.boolean().optional(),
                      })
                      .optional(),
                  })
                )
                .optional(),
            })
            .optional(),
        })
        .optional(),
      memberships: z
        .array(
          z.object({
            userId: z.string().optional(),
            membershipType: z
              .enum(["WORKSPACE", "PROJECT", "USERGROUP"])
              .optional(),
            membershipStatus: z
              .enum(["PENDING", "ACTIVE", "DECLINED", "INACTIVE", "ALL"])
              .optional(),
            hourlyRate: hourlyRate.optional(),
          })
        )
        .optional(),
      tasks: z
        .array(
          z.object({
            assigneeIds: z.array(z.string()).optional(),
            billable: z.boolean().optional(),
            name: z.string(),
            estimate: z.string().optional(),
            hourlyRate: hourlyRate.optional(),
            id: z.string().optional(),
            projectId: z.string().optional(),
            status: z.string().optional(),
            userGroupIds: z.array(z.string()).optional(),
            costRate: costRate.optional(),
          })
        )
        .optional(),
    },
    async (body) => {
      const project = await postRequest("/projects", body);
      return {
        content: [{ type: "text", text: JSON.stringify(project, null, 2) }],
      };
    }
  );

  server.tool(
    "update_project",
    "Update Project in clockify",
    {
      projectId: z.string(),
      archived: z.boolean().optional(),
      billable: z.boolean().optional(),
      clientId: z.string().optional(),
      color: z.string().optional(),
      costRate: costRate.optional(),
      hourlyRate: hourlyRate.optional(),
      isPublic: z.boolean().optional(),
      name: z.string().optional(),
      note: z.string().optional(),
    },
    async (body) => {
      const project = await putRequest(
        `/projects/${body.projectId}`,
        removeKeys(body, "projectId")
      );
      return {
        content: [{ type: "text", text: JSON.stringify(project, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_project",
    "Delete Project from clockify",
    {
      projectId: z.string(),
    },
    async (params) => {
      const success = await deleteRequest(`/projects/${params.projectId}`);
      return {
        content: [{ type: "text", text: JSON.stringify(success, null, 2) }],
      };
    }
  );

  server.tool(
    "mangage_users_project",
    "Assign/remove users to/from the project",
    {
      projectId: z.string(),
      userIds: z.array(z.string()),
      remove: z.boolean().optional(),
    },
    async (body) => {
      const success = await postRequest(
        `/projects/${body.projectId}/memberships`,
        {
          userIds: body.userIds,
          remove: body.remove,
        }
      );
      return {
        content: [{ type: "text", text: JSON.stringify(success, null, 2) }],
      };
    }
  );
};

export default registerProjectTools;
