import Hero from "./components/Hero";
import ClientsSection from "./components/ClientsSection";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import CommitmentSection from "./components/CommitmentSection";
import MethodSection from "./components/MethodSection";
import ProjectsSection from "./components/ProjectsSection";
import EquipmentSection from "./components/EquipmentSection";
import ContactForm from "./components/ContactForm";

export default function Home() {
  return (
    <>
      <Hero />
      <ClientsSection />
      <AboutSection />
      <ServicesSection />
      <CommitmentSection />
      <MethodSection />
      <ProjectsSection />
      <EquipmentSection />
      <ContactForm />
    </>
  );
}
