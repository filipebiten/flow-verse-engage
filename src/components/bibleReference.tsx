import { getVerses, parseReference } from "@/services/bibleService";
import { useState, useEffect } from "react";

interface Props {
  reference: string; 
}

export default function BibleReference({ reference }: Props) {
  const [text, setText] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const parsed = parseReference(reference);
      const verses = getVerses(
        parsed.book, 
        parsed.chapter, 
        parsed.startVerse, 
        parsed.endVerse
      );
      setText(verses);
    } catch (err) {
      setText("-");
    }
  }, [reference]);

  return (
    <div className="border p-4 rounded-md bg-gray-50">
      <div className="flex items-center justify-between">
        <strong className="text-blue-500">{reference}</strong>

        <button
          onClick={() => setOpen(!open)}
          className="text-sm text-blue-600 hover:underline"
        >
          {open ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      {open && (
        <p 
            style={{ whiteSpace: "pre-line" }} 
            className="mt-2 italic">
          {text}
        </p>
      )}
    </div>
  );
}
