import Hero from "./components/Hero";
import ClientsSection from "./components/ClientsSection";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import CommitmentSection from "./components/CommitmentSection";
import MethodSection from "./components/MethodSection";
import ProjectsSection from "./components/ProjectsSection";
import EquipmentSection from "./components/EquipmentSection";
import ContactForm from "./components/ContactForm";
import { getHomeContent } from "./lib/public-content";

export default async function Home() {
  const content = await getHomeContent();

  return (
    <>
      <Hero />
      <ClientsSection clients={content.clients} />
      <AboutSection />
      <ServicesSection featuredServices={content.featuredServices as any} />
      <CommitmentSection />
      <MethodSection />
      <ProjectsSection featuredProjects={content.featuredProjects as any} />
      <EquipmentSection />
      <ContactForm />
    </>
  );
}
