import bible from "/public/pt_nvi.json";

export function extractBibleReference(text: string): string | null {
  const regex = /\b([a-zA-Z]+):(\d+)(:(\d+)(-\d+)?)?\b/;
  const match = text.toLowerCase().match(regex);
  return match ? match[0] : null;
}

export function getBibleVerses(reference: string): string {
  const parts = reference.split(":");

  const book = normalizeBookName(parts[0]);
  const chapter = parseInt(parts[1]);
  let start = 1;
  let end = 999;

  if (parts[2]) {
    if (parts[2].includes("-")) {
      const [v1, v2] = parts[2].split("-").map(Number);
      start = v1;
      end = v2;
    } else {
      start = end = parseInt(parts[2]);
    }
  }

  return getVerses(book, chapter, start, end);
}

function normalizeBookName(input: string): string {
  const normalized = input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();

  const found = bible.find((b: any) => 
    b.name
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase() === normalized
  );

  if (!found) throw new Error("Livro não encontrado");
  return found.name;
}

function getVerses(bookName: string, chapter: number, start: number, end: number): string {
  const book = bible.find((b: any) => b.name === bookName);
  if (!book) throw new Error("Livro não encontrado");

  const verses = book.chapters[chapter - 1];
  if (!verses) throw new Error("Capítulo não encontrado");

  return verses
    .map((v: string, i: number) => ({ n: i + 1, text: v }))
    .filter(v => v.n >= start && v.n <= end)
    .map(v => `${v.n}. ${v.text}`)
    .join(" ");
}
