import bible from '/public/pt_nvi.json';

export interface BibleVerse {
    book: string;
    chapter: number;
    verse: string;
}

export const getRandomBibleVerse = (): BibleVerse => {

    const filteredBooks = bible.filter(
    (book: any) =>
        book.name.toLowerCase() !== "eclesiastes" &&
        book.name.toLowerCase() !== "números"
    );

    const randomBookIndex = Math.floor(Math.random() * filteredBooks.length);
    const selectedBook = filteredBooks[randomBookIndex];

    const randomChapterIndex = Math.floor(Math.random() * selectedBook.chapters.length);
    const selectedChapter = selectedBook.chapters[randomChapterIndex];

    const randomVerseIndex = Math.floor(Math.random() * selectedChapter.length);
    const selectedVerse = selectedChapter[randomVerseIndex];

    return {
        book: selectedBook.name,
        chapter: randomChapterIndex + 1,
        verse: selectedVerse
    };
};

export function parseReference(reference: string) {
  const regex = /^([1-3]?\s?[A-Za-zÀ-ÿ]+)\s+(\d+):(\d+)(?:-(\d+))?$/i;

  const match = reference.match(regex);
  if (!match) throw new Error("Referência inválida");

  const book = normalizeBookName(match[1]); 
  const chapter = Number(match[2]);
  const startVerse = Number(match[3]);
  const endVerse = match[4] ? Number(match[4]) : startVerse;

  return { book, chapter, startVerse, endVerse };
}

export function normalizeBookName(book: string) {
  return book
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ") 
    .replace(/^\d/, m => m + " ");
}

export function getVerses(bookName: string, chapter: number, start: number, end: number): string {
  const book = bible.find((b: any) => b.name.toLowerCase() === bookName.toLocaleLowerCase());

  if (!book) throw new Error("Livro não encontrado");

  const verses = book.chapters[chapter - 1];
  if (!verses) throw new Error("Capítulo não encontrado");

  return verses
    .map((v: string, i: number) => ({ n: i + 1, text: v }))
    .filter(v => v.n >= start && v.n <= end)
    .map(v => `${v.n}. ${v.text}`)
    .join(" ");
}