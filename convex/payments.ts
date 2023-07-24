import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const getMessageId = query({
  args: { paymentId: v.optional(v.id("payments")) },
  handler: async (ctx, { paymentId }) => {
    if (paymentId === undefined) {
      return null;
    }
    return (await ctx.db.get(paymentId))?.messageId;
  },
});

export const create = internalMutation({
  handler: async (ctx, { text }: { text: string }) => {
    return await ctx.db.insert("payments", { text });
  },
});

export const markPending = internalMutation({
  args: { paymentId: v.id("payments"), stripeId: v.string() },
  handler: async (ctx, { paymentId, stripeId }) => {
    await ctx.db.patch(paymentId, { stripeId });
  },
});

export const fulfill = internalMutation({
  args: { stripeId: v.string() },
  handler: async (ctx, { stripeId }) => {
    const { _id: paymentId, text } = (await ctx.db
      .query("payments")
      .withIndex("stripeId", (q) => q.eq("stripeId", stripeId))
      .unique())!;
    const messageId = await ctx.db.insert("messages", { text });
    await ctx.db.patch(paymentId, { messageId });
  },
});
