import { v } from "convex/values";
import { action, httpAction } from "./_generated/server";
import Stripe from "stripe";
import { internal } from "./_generated/api";

export const pay = action({
  args: { text: v.string() },
  handler: async ({ runMutation }, { text }) => {
    const domain = process.env.HOSTING_URL ?? "http://localhost:5173";
    const stripe = new Stripe(process.env.STRIPE_KEY!, {
      apiVersion: "2022-11-15",
    });
    const paymentId = await runMutation(internal.payments.create, { text });
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "USD",
            unit_amount: 100,
            tax_behavior: "exclusive",
            product_data: {
              name: "One message of your choosing",
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${domain}?paymentId=${paymentId}`,
      cancel_url: `${domain}`,
      automatic_tax: { enabled: true },
    });

    await runMutation(internal.payments.markPending, {
      paymentId,
      stripeId: session.id,
    });
    return session.url;
  },
});

export const handleWebhook = httpAction(async (ctx, request) => {
  const signature: string = request.headers.get("stripe-signature") as string;
  const payload = await request.text();
  const stripe = new Stripe(process.env.STRIPE_KEY!, {
    apiVersion: "2022-11-15",
  });
  const webhookSecret = process.env.STRIPE_WEBHOOKS_SECRET as string;
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );
    if (event.type === "checkout.session.completed") {
      const stripeId = (event.data.object as { id: string }).id;
      await ctx.runMutation(internal.payments.fulfill, { stripeId });
    }
    return new Response(null, {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response("Webhook Error", {
      status: 400,
    });
  }
});
