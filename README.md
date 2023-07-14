# Convex Stripe Demo

This example app demonstrates how to integrate Stripe, the payments platform, with Convex, the backend application platform. We keep track of payments in Convex and fulfill orders when they're confirmed by Stripe.

![Screenshot of the app and Stripe's UI](./screenshot.png)

Features:

- You can test the payment flow end to end using Stripe's test card numbers

This integration works! You can see a production deployment at this live site: https://xixixao.github.io/paymorebeseen/.

## Setting up

Run:

```
npm install
npx convex dev
```

This will guide you through making a Convex project.

To test the payments flow, follow these steps:

1. Sign up for Stripe for free at https://stripe.com/
2. [Install the stripe CLI](https://stripe.com/docs/stripe-cli)
3. Run

```
stripe listen --forward-to localhost:5173/stripe
```

4. Copy the "Your webhook signing secret" from the output of the `listen` command, and set it as `STRIPE_WEBHOOKS_SECRET` environment variable on your Convex dashboard
5. Copy your test secret API key from the code example on https://stripe.com/docs/checkout/quickstart and set it as `STRIPE_KEY` environment variable on your Convex dashboard

You can then use the test credit card details to go through the payment flow, see https://stripe.com/docs/checkout/quickstart#testing

## Running the App

Run:

```
npm run dev
```
