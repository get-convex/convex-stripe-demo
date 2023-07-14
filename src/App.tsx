import { FormEvent, useEffect, useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export default function App() {
  const paymentId = useConsumeQueryParam("paymentId");

  const sentMessageId = useQuery(api.payments.getMessageId, {
    paymentId: (paymentId ?? undefined) as Id<"payments"> | undefined,
  });
  const messages = useQuery(api.messages.list) || [];

  const [newMessageText, setNewMessageText] = useState("");
  const payAndSendMessage = useAction(api.stripe.pay);

  async function handleSendMessage(event: FormEvent) {
    event.preventDefault();
    const paymentUrl = await payAndSendMessage({ text: newMessageText });
    window.location.href = paymentUrl!;
  }
  return (
    <main>
      <h1>Convex Paid Chat</h1>
      <ul>
        {messages.map((message) => (
          <li
            key={message._id}
            className={sentMessageId === message._id ? "sent" : ""}
          >
            <span>{message.text}</span>
            <span>{new Date(message._creationTime).toLocaleTimeString()}</span>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSendMessage}>
        <input
          value={newMessageText}
          onChange={(event) => setNewMessageText(event.target.value)}
          placeholder="Write a message…"
        />
        <input
          type="submit"
          value="Pay $1 and send"
          disabled={newMessageText === ""}
        />
      </form>
    </main>
  );
}

function useConsumeQueryParam(name: string) {
  const [value] = useState(
    new URLSearchParams(window.location.search).get(name)
  );

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const searchParams = currentUrl.searchParams;
    searchParams.delete(name);
    const consumedUrl =
      currentUrl.origin + currentUrl.pathname + searchParams.toString();
    window.history.replaceState(null, "", consumedUrl);
  }, []);
  return value;
}
