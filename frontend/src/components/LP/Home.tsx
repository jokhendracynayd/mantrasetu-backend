import Hero from "@/components/LP/Hero";
import SpiritualJourney from "@/components/LP/SpiritualJourney";
import SpecialPujas from "@/components/LP/SpecialPujas";
import Services from "@/components/LP/Services";
import SpiritualTools from "@/components/LP/SpiritualTools";
import About from "@/components/LP/About";
import Contact from "@/components/LP/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <SpiritualJourney />
      <SpecialPujas />
      <Services />
      <SpiritualTools />
      <About />
      <Contact />
    </main>
  );
}