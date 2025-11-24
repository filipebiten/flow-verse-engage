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
                    <li>Novos Filtros para missões</li>
                    <li>Melhor organização de missões</li>
                </ul>
            </p>
        </CardContent>
    </Card>;
}