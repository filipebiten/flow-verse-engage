import {Phase} from "@/utils/phaseUtils.ts";
import React from "react";

export function PhasePhrase(props: { userPhase: Phase, size?: string }) {
    const getPhaseInfo = (phase: string) => {
        const phases = {
            "Riacho": {color: "text-green-800"},
            "Correnteza": {color: "text-blue-800"},
            "Cachoeira": {color: "text-purple-800"},
            "Oceano": {color: "text-white"}
        };
        return phases[phase as keyof typeof phases] || phases["Riacho"];
    };
    return <p
        className={`italic text-center ${!props.size ? 'text-sm' : props.size} ${getPhaseInfo(props.userPhase.name).color}`}>´´{props.userPhase.phrase}´´</p>;
}