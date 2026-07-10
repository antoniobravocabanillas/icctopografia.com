import DetailPage from "../../components/DetailPage";
import { terraqoData } from "../../lib/terraqo-data";
import { cleanArray, cleanText } from "../../lib/text";

export function generateStaticParams() {
  return terraqoData.products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = terraqoData.products.find((item) => item.slug === slug);
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
        specs: Object.fromEntries(Object.entries(product.specs || {}).map(([key, value]) => [cleanText(key), cleanText(value)])),
      }
    : product;
  return <DetailPage item={cleanProduct} type="product" />;
}
