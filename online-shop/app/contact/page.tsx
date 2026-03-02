"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (fullName.trim().length < 3) return toast.error("Full Name must be at least 3 characters");
    if (subject.trim().length < 3) return toast.error("Subject must be at least 3 characters");
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Invalid email address");
    if (message.trim().length < 10) return toast.error("Message must be at least 10 characters");

    console.log({ fullName, subject, email, message });
    toast.success("Message sent successfully!");

    // Reset form
    setFullName("");
    setSubject("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-coral-50 flex items-center justify-center py-16 px-4">
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left side - Info panel */}
        <div className="md:w-1/2 bg-teal-600 text-white p-10 flex flex-col justify-center gap-6">
          <h2 className="text-4xl font-extrabold mb-2">Get in Touch</h2>
          <p className="text-teal-100">
            Have questions or want to collaborate? Fill out the form and we’ll get back to you shortly.
          </p>
          <div className="space-y-2 text-teal-100/90">
            <p><span className="font-semibold">Email:</span> contact@myshop.com</p>
            <p><span className="font-semibold">Phone:</span> +47 123 456 789</p>
          </div>
          <div className="mt-4">
            <p className="italic text-teal-200 text-sm">
              We typically respond within 24 hours.
            </p>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="md:w-1/2 p-10 bg-white flex flex-col justify-center gap-6">
          <h2 className="text-3xl font-bold text-teal-900 mb-4">Contact Form</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
              required
            />
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
              required
            />
            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition resize-none"
              required
            ></textarea>
            <button
  type="submit"
  className="w-full py-4 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 shadow-lg transition duration-300"
>
  Send Message
</button>

          </form>
        </div>

      </div>
    </div>
  );
}
