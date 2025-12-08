"use client";

import { useState } from "react";
import BackButton from "@/components/BackButton";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const submitForm = async () => {
    if (!name || !email || !message) {
      setSuccess("Please fill all fields.");
      return;
    }

    setLoading(true);
    setSuccess("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess("Message sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setSuccess("Something went wrong.");
      }
    } catch (error) {
      setSuccess("Server error. Please try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <BackButton />

      <h1 className="text-3xl font-bold mb-6 text-yellow-500">
        Contact Support
      </h1>

      <div className="space-y-4 bg-white p-6 rounded-lg shadow">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Your Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <textarea
          placeholder="Message"
          className="w-full border p-2 rounded h-32"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <button
          onClick={submitForm}
          disabled={loading}
          className="w-full bg-yellow-500 disabled:bg-gray-400 text-white py-2 rounded hover:bg-yellow-600"
        >
          {loading ? "Sending..." : "Submit"}
        </button>

        {success && <p className="text-green-600">{success}</p>}
      </div>
    </div>
  );
}
