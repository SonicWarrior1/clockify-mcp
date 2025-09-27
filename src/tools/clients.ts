import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
  removeKeys,
} from "../utils.js";

const registerClientTools = (server: McpServer) => {
  server.tool(
    "get_clients",
    "Get Clients from clockify",
    {
      name: z.string().optional(),
      page: z.string().optional(),
      "page-size": z.string().optional(),
      archived: z.boolean().optional(),
    },
    async (params) => {
      const clients = await getRequest("/clients", params);
      return {
        content: [{ type: "text", text: JSON.stringify(clients, null, 2) }],
      };
    }
  );

  server.tool(
    "add_client",
    "Add Client to clockify",
    {
      name: z.string().optional(),
      email: z.string().optional(),
      address: z.string().optional(),
      note: z.string().optional(),
    },
    async (params) => {
      const client = await postRequest("/clients", params);
      return {
        content: [{ type: "text", text: JSON.stringify(client, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_client",
    "Delete Client from clockify",
    {
      clientId: z.string(),
    },
    async (params) => {
      await deleteRequest(`/clients/${params.clientId}`);
      return {
        content: [{ type: "text", text: `Client ${params.clientId} deleted` }],
      };
    }
  );

  server.tool(
    "get_client_by_id",
    "Get Client by ID from clockify",
    {
      clientId: z.string(),
    },
    async (params) => {
      const client = await getRequest(`/clients/${params.clientId}`);
      return {
        content: [{ type: "text", text: JSON.stringify(client, null, 2) }],
      };
    }
  );

  server.tool(
    "update_client",
    "Update Client in clockify",
    {
      clientId: z.string(),
      address: z.string().optional(),
      archived: z.boolean().optional(),
      email: z.string().optional(),
      name: z.string().optional(),
      note: z.string().optional(),
    },
    async (body) => {
      const client = await putRequest(
        `/clients/${body.clientId}`,
        removeKeys(body, "clientId")
      );
      return {
        content: [{ type: "text", text: JSON.stringify(client, null, 2) }],
      };
    }
  );
};

export default registerClientTools;
