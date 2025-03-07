"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Section1 from "./components/Section1";
import Section2 from "./components/Section2";
import Section3 from "./components/Section3";
import Section4 from "./components/Section4";
import Section5 from "./components/Section5";
import Section6 from "./components/Section6";
import Section7 from "./components/Section7";

export default function Home() {

  return (
    <main className="relative h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      {<Navbar />}

      <div className="pt-12">
        <section id="section1" className="h-screen snap-start"><Section1 /></section>
        <section id="section2" className="h-screen snap-start"><Section2 /></section>
        <section id="section3" className="h-screen snap-start"><Section3 /></section>
        <section id="section4" className="h-screen snap-start"><Section4 /></section>
        <section id="section5" className="h-screen snap-start"><Section5 /></section>
        <section id="section6" className="h-screen snap-start"><Section6 /></section>
        <section id="section7" className="h-screen snap-start"><Section7 /></section>
      </div>

    </main>
  );
}
