import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseGeminiResponse = (text: string) => {
  const questionRegex = /\*\*Title:\*\*\s*(.+?)\s*\n+?\*\*Description:\*\*\s*([\s\S]*?)(?=\n{2,}\*\*Title:\*\*|\s*$)/g;

  const parsed = [];
  let match;

  while ((match = questionRegex.exec(text)) !== null) {
    const title = match[1].trim();
    const description = match[2].trim();

    parsed.push({ title, description });
  }
  console.log("🧪 Raw Gemini Response:", text);
  console.log("✅ Parsed Questions:", parsed);
  return parsed;
};

