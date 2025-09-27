import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { postRequest, REPORT_BASE_URL } from "../utils.js";
const registerReportTools = (server: McpServer) => {
  server.tool(
    "get_reports",
    "Get Detailed Reports from clockify",
    {
      dateRangeEnd: z.string(),
      dateRangeStart: z.string(),
      detailedFilter: z.object({
        page: z.string().optional(),
        "page-size": z.string().optional(),
        "sort-column": z
          .enum([
            "ID",
            "DESCRIPTION",
            "USER",
            "DURATION",
            "DATE",
            "NATURAL",
            "USER_DATE",
          ])
          .optional(),
      }),
      dateRangeType: z
        .enum([
          "ABSOLUTE",
          "TODAY",
          "YESTERDAY",
          "THIS_WEEK",
          "LAST_WEEK",
          "PAST_TWO_WEEKS",
          "THIS_MONTH",
          "LAST_MONTH",
          "THIS_YEAR",
          "LAST_YEAR",
        ])
        .optional(),
      "sort-order": z.enum(["ASCENDING", "DESCENDING"]).optional(),
      projects: z
        .object({
          contains: z
            .enum(["CONTAINS", "DOES_NOT_CONTAIN", "CONTAINS_ONLY"])
            .optional(),
          ids: z.array(z.string()).optional(),
          status: z.enum(["ACTIVE", "ARCHIVED", "ALL"]).optional(),
        })
        .optional(),
      users: z
        .object({
          contains: z
            .enum(["CONTAINS", "DOES_NOT_CONTAIN", "CONTAINS_ONLY"])
            .optional(),
          ids: z.array(z.string()).optional(),
          status: z.enum(["ACTIVE", "ARCHIVED", "ALL"]).optional(),
        })
        .optional(),
      tasks: z
        .object({
          contains: z
            .enum(["CONTAINS", "DOES_NOT_CONTAIN", "CONTAINS_ONLY"])
            .optional(),
          ids: z.array(z.string()).optional(),
          status: z.enum(["ACTIVE", "ARCHIVED", "ALL"]).optional(),
        })
        .optional(),
      archived: z.boolean().optional(),
      billable: z.boolean().optional(),
    },
    async (body) => {
      const reports = await postRequest(
        "/reports/detailed",
        body,
        REPORT_BASE_URL
      );
      return {
        content: [{ type: "text", text: JSON.stringify(reports, null, 2) }],
      };
    }
  );
};

export default registerReportTools;
