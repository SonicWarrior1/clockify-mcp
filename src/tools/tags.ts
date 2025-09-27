import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "../utils.js";
const registerTagsTools = (server: McpServer) => {
  server.tool(
    "get_tags",
    "Get Tags from clockify",
    {
      name: z.string().optional(),
      archived: z.boolean().optional(),
      page: z.string().optional(),
      "page-size": z.string().optional(),
      "sort-column": z.enum(["ID", "NAME"]).optional(),
      "sort-order": z.enum(["ASCENDING", "DESCENDING"]).optional(),
    },
    async (params) => {
      const tags = await getRequest("/tags", params);
      return {
        content: [{ type: "text", text: JSON.stringify(tags, null, 2) }],
      };
    }
  );

  server.tool(
    "get_tag_by_id",
    "Get Tag by ID from clockify",
    { tagId: z.string() },
    async (params) => {
      const tag = await getRequest(`/tags/${params.tagId}`);
      return {
        content: [{ type: "text", text: JSON.stringify(tag, null, 2) }],
      };
    }
  );

  server.tool(
    "add_tag",
    "Add Tag to clockify",
    { name: z.string() },
    async (body) => {
      const tag = await postRequest("/tags", body);
      return {
        content: [{ type: "text", text: JSON.stringify(tag, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_tag",
    "Delete Tag from clockify",
    { tagId: z.string() },
    async (body) => {
      const tag = await deleteRequest(`/tags/${body.tagId}`);
      return {
        content: [{ type: "text", text: JSON.stringify(tag, null, 2) }],
      };
    }
  );

  server.tool(
    "update_tag",
    "Update Tag in clockify",
    {
      tagId: z.string(),
      name: z.string().optional(),
      archived: z.boolean().optional(),
    },
    async (body) => {
      const tag = await putRequest(`/tags/${body.tagId}`, {
        name: body.name,
        archived: body.archived,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(tag, null, 2) }],
      };
    }
  );
};

export default registerTagsTools;
