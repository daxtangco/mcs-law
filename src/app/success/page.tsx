import Hero from "@/components/Hero";
import SignInBlock from "@/components/SignInBlock";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <SignInBlock /> 
      <section id="services"><Services /></section>
      <section id="contact"><Contact /></section>
      <Footer />
    </div>
  );
}
