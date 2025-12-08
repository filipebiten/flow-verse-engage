import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import React from "react";

export function UpdatesCard() {
    return <Card className="bg-green-50 text-gray-700 card">
        <CardHeader className="pb-3 border-b border-border/70">
            <CardTitle>
                <p className="text-lg font-bold text-green-600">Novidades</p>
            </CardTitle>
        </CardHeader>

        <CardContent className="p-4">
            <p className="">
                <ul className="list-inside list-disc text-sm">
                    <li>Citações de Versículos da Bíblia podem ser feitas via comentário seguindo o padrão: Nome do Livro Capítulo:Versículo inicial-Versículo final - Exemplo: Apocalipse 16:15;</li>
                    <li>Card de Versículo aleatório.</li>
                </ul>
            </p>
        </CardContent>
    </Card>;
}