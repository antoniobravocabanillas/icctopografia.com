export const terraqoBaseUrl =
  process.env.TERRAQO_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_TERRAQO_API_URL ||
  "https://iridescent-fenglisu-d6595c.netlify.app";

export function terraqoUrl(path: string) {
  return `${terraqoBaseUrl.replace(/\/$/, "")}${path}`;
}
