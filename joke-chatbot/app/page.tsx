"use client";

import { useState } from "react";
import { useChat } from "ai/react";
import styles from "../app/styles/chat.module.css";

export default function Chat() {
  // Destructure setMessages so we can reset the chat
  const { messages, handleSubmit, append, setMessages } = useChat();
  const [tone, setTone] = useState("witty");
  const [jokeType, setJokeType] = useState("pun");
  const [customMessage, setCustomMessage] = useState("");

  const handleGenerateJoke = async () => {
    // Clear existing messages
    setMessages([]);

    // Build the prompt incorporating tone, joke type, and optional custom message
    const prompt = `Tell me a ${tone} ${jokeType} joke.${
      customMessage ? " " + customMessage : ""
    }`;

    // Immediately add the prompt as a user message
    append({ role: "user", content: prompt });

    try {
      const response = await fetch("/api/generate-joke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) throw new Error("Error generating joke");

      const data = await response.json();
      append({ role: "ai", content: data.joke });
    } catch (error) {
      console.error("Error generating joke:", error);
      append({
        role: "ai",
        content: "Sorry, I couldn't generate a joke at this time.",
      });
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <h1 className={styles.mainTitle}>Welcome to the Jokemaster!</h1>
        <p className={styles.subTitle}>Your personal AI-powered joke generator.</p>
      </div>

      {/* Card Container */}
      <div className={styles.card}>
        {/* Tone Dropdown */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Joke Tone</label>
          <select
            className={styles.select}
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="witty">Witty</option>
            <option value="sarcastic">Sarcastic</option>
            <option value="silly">Silly</option>
            <option value="dark">Dark</option>
            <option value="goofy">Goofy</option>
          </select>
        </div>

        {/* Joke Type Dropdown */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Joke Type</label>
          <select
            className={styles.select}
            value={jokeType}
            onChange={(e) => setJokeType(e.target.value)}
          >
            <option value="pun">Pun</option>
            <option value="knock-knock">Knock-knock</option>
            <option value="story">Story</option>
          </select>
        </div>

        {/* Custom Message (Optional) */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Custom Message (Optional)</label>
          <input
            className={styles.input}
            placeholder="Add any themes or topics you'd like..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
          />
        </div>

        {/* Generate Joke Button */}
        <button onClick={handleGenerateJoke} className={styles.button}>
          Generate Joke
        </button>

        {/* Output / Messages */}
        <div className={styles.output}>
          {messages.length === 0 ? (
            <p className={styles.placeholder}>
              Your generated joke will appear here...
            </p>
          ) : (
            messages
            .map((m) => (
              <div key={m.id} className={styles.message}>
                <strong>{m.role === "user" ? "User:" : "AI:"}</strong>{" "}
                {m.content}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        © 2025 JokeMaster AI. All rights reserved.
      </footer>
    </div>
  );
}
