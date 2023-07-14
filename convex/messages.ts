import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async ({ db }) => {
    return await db.query("messages").collect();
  },
});
