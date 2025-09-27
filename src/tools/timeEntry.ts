import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
  removeKeys,
} from "../utils.js";
const registerTimeEntryTools = (server: McpServer) => {
  server.tool(
    "add_time_entry",
    "Add Time Entry to clockify",
    {
      billable: z.boolean().optional(),
      description: z.string().optional(),
      end: z.string().optional(),
      projectId: z.string().optional(),
      start: z.string(),
      tagIds: z.array(z.string()).optional(),
      taskId: z.string().optional(),
      type: z.enum(["REGULAR", "BREAK"]).optional(),
    },
    async (body) => {
      const timeEntry = await postRequest("/time-entries", body);
      return {
        content: [{ type: "text", text: JSON.stringify(timeEntry, null, 2) }],
      };
    }
  );

  server.tool(
    "get_in_progress_time_entry",
    "Get In-Progress Time Entry from clockify",
    { page: z.string().optional(), "page-size": z.string().optional() },
    async (body) => {
      const timeEntry = await getRequest("/time-entries/in-progress", body);
      return {
        content: [{ type: "text", text: JSON.stringify(timeEntry, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_time_entry",
    "Delete Time Entry from clockify",
    { id: z.string() },
    async (body) => {
      const timeEntry = await deleteRequest(`/time-entries/${body.id}`);
      return {
        content: [{ type: "text", text: JSON.stringify(timeEntry, null, 2) }],
      };
    }
  );

  server.tool(
    "get_specific_time_entry",
    "Get Specific Time Entry from clockify",
    { id: z.string() },
    async (body) => {
      const timeEntry = await getRequest(`/time-entries/${body.id}`);
      return {
        content: [{ type: "text", text: JSON.stringify(timeEntry, null, 2) }],
      };
    }
  );

  server.tool(
    "update_time_entry",
    "Update Time Entry in clockify",
    {
      id: z.string(),
      billable: z.boolean().optional(),
      description: z.string().optional(),
      end: z.string().optional(),
      projectId: z.string().optional(),
      start: z.string(),
      tagIds: z.array(z.string()).optional(),
      taskId: z.string().optional(),
      type: z.enum(["REGULAR", "BREAK"]).optional(),
    },
    async (body) => {
      const timeEntry = await putRequest(
        `/time-entries/${body.id}`,
        removeKeys(body, "id")
      );
      return {
        content: [{ type: "text", text: JSON.stringify(timeEntry, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_all_time_entries_for_user",
    "Delete All Time Entries for User from clockify",
    { userId: z.string(), "time-entry-ids": z.array(z.string()) },
    async (body) => {
      const response = await deleteRequest(
        `/time-entries/user/${body.userId}/time-entries`,
        {
          "time-entry-ids": body["time-entry-ids"],
        }
      );
      return {
        content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
      };
    }
  );

  server.tool(
    "get_time_entries_for_user",
    "Get Time Entries for User from clockify",
    {
      userId: z.string(),
      description: z.string().optional(),
      start: z.string().optional(),
      end: z.string().optional(),
      project: z.string().optional(),
      task: z.string().optional(),
      tags: z.array(z.string()).optional(),
      "project-required": z.boolean().optional(),
      "task-required": z.boolean().optional(),
      page: z.string().optional(),
      "page-size": z.string().optional(),
      "in-progress": z.boolean().optional(),
    },
    async (body) => {
      const timeEntries = await getRequest(
        `/user/${body.userId}/time-entries`,
        removeKeys(body, "userId")
      );
      return {
        content: [{ type: "text", text: JSON.stringify(timeEntries, null, 2) }],
      };
    }
  );

  server.tool(
    "stop_currently_running_time_entry",
    "Stop Currently Running Time Entry from clockify",
    { userId: z.string(), end: z.string() },
    async (body) => {
      const timeEntry = await patchRequest(
        `/user/${body.userId}/time-entries`,
        { end: body.end }
      );
      return {
        content: [{ type: "text", text: JSON.stringify(timeEntry, null, 2) }],
      };
    }
  );

  server.tool(
    "add_time_entry_for_another_user",
    "Add a new time entry for another user",
    {
      userId: z.string(),
      billable: z.boolean().optional(),
      description: z.string().optional(),
      end: z.string().optional(),
      projectId: z.string().optional(),
      start: z.string(),
      tagIds: z.array(z.string()).optional(),
      taskId: z.string().optional(),
      type: z.enum(["REGULAR", "BREAK"]).optional(),
    },
    async (body) => {
      const timeEntry = await postRequest(
        `/user/${body.userId}/time-entries`,
        removeKeys(body, "userId")
      );
      return {
        content: [{ type: "text", text: JSON.stringify(timeEntry, null, 2) }],
      };
    }
  );
};

export default registerTimeEntryTools;
