import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { internalMutation, query } from "./_generated/server";

export const getMessageId = query({
  args: { paymentId: v.optional(v.id("payments")) },
  handler: async ({ db }, { paymentId }) => {
    if (paymentId === undefined) {
      return null;
    }
    return (await db.get(paymentId))?.messageId;
  },
});

export const create = internalMutation(
  async ({ db }, { text }: { text: string }) => {
    return await db.insert("payments", { text });
  }
);

export const markPending = internalMutation(
  async (
    { db },
    { paymentId, stripeId }: { paymentId: Id<"payments">; stripeId: string }
  ) => {
    await db.patch(paymentId, { stripeId });
  }
);

export const fulfill = internalMutation(
  async ({ db }, { stripeId }: { stripeId: string }) => {
    const { _id: paymentId, text } = (await db
      .query("payments")
      .withIndex("stripeId", (q) => q.eq("stripeId", stripeId))
      .unique())!;
    const messageId = await db.insert("messages", { text });
    await db.patch(paymentId, { messageId });
  }
);
