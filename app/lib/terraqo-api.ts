export const terraqoBaseUrl =
  process.env.TERRAQO_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_TERRAQO_API_URL ||
  "https://api.terraqoglobal.com";

export function terraqoUrl(path: string) {
  return `${terraqoBaseUrl.replace(/\/$/, "")}${path}`;
}
