import SellableProductDetail from "../../components/SellableProductDetail";
import { getPublicContent } from "../../lib/public-content";
import { cleanArray, cleanText } from "../../lib/text";
import { notFound } from "next/navigation";

export const revalidate = 300;

export async function generateStaticParams() {
  const content = await getPublicContent();
  return content.products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getPublicContent();
  const product = content.products.find((item) => item.slug === slug);
  if (!product) notFound();
  const cleanProduct = product
    ? {
        ...product,
        name: cleanText(product.name),
        title: cleanText(product.title),
        category: cleanText(product.category),
        brand: cleanText(product.brand),
        model: cleanText(product.model),
        summary: cleanText(product.summary),
        description: cleanText(product.description),
        availability: cleanText(product.availability),
        badge: cleanText(product.badge),
        tags: cleanArray(product.tags),
        specs: Object.fromEntries(Object.entries((product as any).specs || (product as any).specifications || {}).map(([key, value]) => [cleanText(key), cleanText(value)])),
      }
    : product;
  const related = content.products
    .filter((item) => item.slug !== slug)
    .map((item) => ({
      ...item,
      name: cleanText(item.name),
      title: cleanText(item.title),
      category: cleanText(item.category),
      brand: cleanText(item.brand),
      model: cleanText(item.model),
      summary: cleanText(item.summary),
      description: cleanText(item.description),
      availability: cleanText(item.availability),
      badge: cleanText(item.badge),
      tags: cleanArray(item.tags),
      specs: Object.fromEntries(Object.entries((item as any).specs || (item as any).specifications || {}).map(([key, value]) => [cleanText(key), cleanText(value)])),
    }));
  return <SellableProductDetail product={cleanProduct as any} related={related as any} />;
}
