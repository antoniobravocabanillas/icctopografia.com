import DetailPage from "../../components/DetailPage";
import { terraqoData } from "../../lib/terraqo-data";
import { cleanArray, cleanText } from "../../lib/text";

export function generateStaticParams() {
  return terraqoData.projects.map((project) => ({ slug: project.slug }));
}

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = terraqoData.projects.find((item) => item.slug === slug);
  const cleanProject = project
    ? {
        ...project,
        title: cleanText(project.title),
        sector: cleanText(project.sector),
        location: cleanText(project.location),
        summary: cleanText(project.summary),
        challenge: cleanText(project.challenge),
        solution: cleanText(project.solution),
        result: cleanText(project.result),
        clientName: cleanText(project.clientName),
        services: cleanArray(project.services),
        progress: (project.progress || []).map((entry) => [cleanText(entry[0]), cleanText(entry[1])]),
      }
    : project;
  return <DetailPage item={cleanProject} type="project" />;
}
