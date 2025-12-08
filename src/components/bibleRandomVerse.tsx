import { BibleVerse, getRandomBibleVerse } from "@/services/bibleService";
import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "@radix-ui/react-separator";
import { AlertCircleIcon, BookOpen } from "lucide-react";

export default function BibleRandomVerse(){

    const [randomVerse, setRandomVerse] = useState<BibleVerse>(null);

    useEffect(() => {
        setRandomVerse(getRandomBibleVerse());
    }, []);

    return (
        <Card 
            className="p-4 bg-white/70 backdrop-blur-sm shadow-sm 
                border border-purple-200/40 hover:shadow-md transition-all 
                rounded-xl"
            >
            <CardHeader className="pb-2">
                <CardTitle 
                    className="text-lg font-bold text-purple-700 flex 
                        items-center gap-2"
                    >
                    <BookOpen 
                        className="w-5 h-5 text-purple-600" />
                    Versículo Aleatório
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                <p className="italic text-gray-700 text-base leading-relaxed">
                    "{randomVerse?.verse}"
                </p>

                <Separator className="my-1 bg-purple-300/40" />

                <p className="text-sm font-semibold text-purple-600">
                    {randomVerse?.book} — Capitulo {randomVerse?.chapter}
                </p>
            </CardContent>

            <CardFooter 
                className="text-sm text-red-700 flex items-center gap-2">
                <AlertCircleIcon 
                    className="w-5 h-5 text-red-700"
                ></AlertCircleIcon>
                Por favor verifique sua Bíblia e/ou consulte seu pastor para entender o contexto.
            </CardFooter>
        </Card>

    )
}