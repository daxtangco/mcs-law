"use client";
import { useForm } from "react-hook-form";
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const ContactPage = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    await addDoc(collection(db, "messages"), { ...data, timestamp: serverTimestamp() });
    alert("Message sent!");
    reset();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-800">Contact Us</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <input {...register("name")} className="border p-2 w-full" placeholder="Your Name" />
        <input {...register("email")} className="border p-2 w-full" placeholder="Your Email" />
        <textarea {...register("message")} className="border p-2 w-full" placeholder="Your Message"></textarea>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">Send</button>
      </form>
    </div>
  );
};

export default ContactPage;
