"use client";
import { useForm } from "react-hook-form";

const Contact = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: any) => {
    console.log("Message submitted:", data);
    alert("Message sent!");
    reset();
  };

  return (
    <section className="py-20 bg-gray-200 text-center">
      <h2 className="text-4xl font-bold text-green-900">Contact Us</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto mt-6 space-y-4">
        <input {...register("name")} className="border p-3 w-full rounded" placeholder="Your Name" />
        <input {...register("email")} className="border p-3 w-full rounded" placeholder="Your Email" />
        <textarea {...register("message")} className="border p-3 w-full rounded" placeholder="Your Message"></textarea>
        <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded w-full">Send</button>
      </form>
    </section>
  );
};

export default Contact;
