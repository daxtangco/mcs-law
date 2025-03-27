"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const ChatPage = () => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;
    await addDoc(collection(db, "messages"), {
      text: message,
      user: user?.displayName || "Anonymous",
      timestamp: new Date(),
    });
    setMessage("");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-800">Chat Support</h1>

      <div className="mt-4 border p-4 rounded-lg h-64 overflow-auto bg-gray-100">
        {messages.map((msg) => (
          <p key={msg.id}><strong>{msg.user}:</strong> {msg.text}</p>
        ))}
      </div>

      <input value={message} onChange={(e) => setMessage(e.target.value)} className="border p-2 w-full mt-2" placeholder="Type a message..." />
      <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 mt-2">Send</button>
    </div>
  );
};

export default ChatPage;
