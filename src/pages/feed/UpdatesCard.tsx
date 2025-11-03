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
                    <li>Card de Próximos Aniversariantes</li>
                    <li>Agora é possível adicionar uma Bio no seu perfil ao editar o perfil</li>
                    <li>Reporte bugs ou sugira novas funções em "Ações Rápidas"</li>
                </ul>
            </p>
        </CardContent>
    </Card>;
}