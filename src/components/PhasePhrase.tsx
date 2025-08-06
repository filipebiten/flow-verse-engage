import {Phase} from "@/utils/phaseUtils.ts";
import React from "react";

export function PhasePhrase(props: { userPhase: Phase }) {
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
        className={`text-xs italic text-center ${getPhaseInfo(props.userPhase.name).color}`}>´´{props.userPhase.phrase}´´</p>;
}