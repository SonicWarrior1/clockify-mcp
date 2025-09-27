import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
  removeKeys,
} from "../utils.js";

const registerTaskTools = (server: McpServer) => {
  server.tool(
    "get_tasks",
    "Get Tasks from clockify",
    {
      projectId: z.string(),
      page: z.string().optional(),
      "page-size": z.string().optional(),
      "sort-column": z.enum(["ID", "NAME"]).optional(),
      "sort-order": z.enum(["ASCENDING", "DESCENDING"]).optional(),
      name: z.string().optional(),
      "is-active": z.boolean().optional(),
    },
    async (params) => {
      const tasks = await getRequest(
        `/projects/${params.projectId}/tasks`,
        removeKeys(params, "projectId")
      );
      return {
        content: [{ type: "text", text: JSON.stringify(tasks, null, 2) }],
      };
    }
  );

  server.tool(
    "add_task",
    "Add Task to a project in clockify",
    {
      projectId: z.string(),
      name: z.string(),
      id: z.string().optional(),
      assigneeIds: z.array(z.string()).optional(),
      estimate: z.string().optional(),
      status: z.enum(["ACTIVE", "DONE", "ALL"]).optional(),
    },
    async (body) => {
      const tasks = await postRequest(
        `/projects/${body.projectId}/tasks`,
        removeKeys(body, "projectId")
      );
      return {
        content: [{ type: "text", text: JSON.stringify(tasks, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_task",
    "Delete Task from clockify",
    {
      taskId: z.string(),
      projectId: z.string(),
    },
    async (body) => {
      const response = await deleteRequest(
        `/projects/${body.projectId}/tasks/${body.taskId}`
      );
      return {
        content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "get_task_by_id",
    "Get Task by ID from clockify",
    {
      taskId: z.string(),
      projectId: z.string(),
    },
    async (params) => {
      const task = await getRequest(
        `/projects/${params.projectId}/tasks/${params.taskId}`
      );
      return {
        content: [{ type: "text", text: JSON.stringify(task, null, 2) }],
      };
    }
  );

  server.tool(
    "update_task",
    "Update Task in clockify",
    {
      taskId: z.string(),
      projectId: z.string(),
      assigneeIds: z.array(z.string()).optional(),
      billable: z.boolean().optional(),
      estimate: z.string().optional(),
      name: z.string(),
      status: z.enum(["ACTIVE", "DONE", "ALL"]).optional(),
    },
    async (body) => {
      const task = await putRequest(
        `/projects/${body.projectId}/tasks/${body.taskId}`,
        removeKeys(body, ["projectId", "taskId"])
      );
      return {
        content: [{ type: "text", text: JSON.stringify(task, null, 2) }],
      };
    }
  );
};

export default registerTaskTools;
