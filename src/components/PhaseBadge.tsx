import {Badge} from "@/components/ui/badge.tsx";
import React from "react";

export function PhaseBadge(props: { userPhase: string }) {
    const getPhaseInfo = (phase: string) => {
        const phases = {
            "Riacho": {emoji: "🌀", color: "bg-green-100 text-green-800 hover:bg-green-200"},
            "Correnteza": {emoji: "🌊", color: "bg-blue-100 text-blue-800 hover:bg-blue-200"},
            "Cachoeira": {emoji: "💥", color: "bg-purple-100 text-purple-800 hover:bg-purple-200"},
            "Oceano": {emoji: "🌌", color: "bg-gray-900 text-white hover:bg-purple-200"}
        };
        return phases[phase as keyof typeof phases] || phases["Riacho"];
    };

    return (
        <div className="flex items-center space-x-3 mt-1">
            <Badge className={getPhaseInfo(props.userPhase).color}>
                <span className="text-lg">{getPhaseInfo(props.userPhase).emoji}</span>
                {props.userPhase}
            </Badge>
        </div>
    )
}