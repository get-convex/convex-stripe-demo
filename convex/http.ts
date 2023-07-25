import { httpRouter } from "convex/server";
import { handleWebhook } from "./stripe";

const http = httpRouter();

http.route({
  path: "/stripe",
  method: "POST",
  handler: handleWebhook,
});

export default http;
