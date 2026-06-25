"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Message = {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
};

export default function ChatPage({ params }: { params: { syncId: string } }) {
  const { syncId } = params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/chat/${syncId}`);
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages ?? []);
        } else {
          alert(data.message || "Failed to load chat");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load chat");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [syncId]);

  async function sendMessage() {
    if (!content.trim()) return;

    try {
      const res = await fetch(`/api/chat/${syncId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages((m) => [...m, data.message]);
        setContent("");
      } else {
        alert(data.message || "Failed to send message");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Chat</h2>
        <button onClick={() => router.back()} className="text-sm text-slate-500">Back</button>
      </div>

      <div className="mb-4 space-y-3 rounded-md border p-4">
        {loading ? (
          <div className="text-sm text-slate-500">Loading messages…</div>
        ) : messages.length === 0 ? (
          <div className="text-sm text-slate-500">No messages yet. Start the conversation.</div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="rounded-md border p-3">
              <div className="text-sm text-slate-700">{m.content}</div>
              <div className="mt-1 text-xs text-slate-400">{new Date(m.createdAt).toLocaleString()}</div>
            </div>
          ))
        )}
      </div>

      <div className="space-y-3">
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write a message to the creator" />
        <div className="flex justify-end">
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </main>
  );
}
