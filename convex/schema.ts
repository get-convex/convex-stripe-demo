import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    payments: defineTable({
      text: v.string(),
      // If present the payment has been initiated
      stripeId: v.optional(v.string()),
      // If present the payment has been fulfilled
      messageId: v.optional(v.id("messages")),
    }).index("stripeId", ["stripeId"]),
    messages: defineTable({
      text: v.string(),
    }),
  },
  { schemaValidation: false }
);
