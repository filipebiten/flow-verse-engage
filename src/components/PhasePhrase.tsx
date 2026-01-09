import { usePhases } from "@/contexts/phaseContext";
import resolvePhaseColor, { resolveFontColor } from "@/utils/colorUtil";

interface PhasePhraseProps {
    phaseName: string;
    size?: string;
}

export function PhasePhrase({ phaseName, size }: PhasePhraseProps) {
    
    const { phases, loading } = usePhases();

    const getPhaseInfo = () => {
        return phases.find(phase => phase.name === phaseName);
    };

    return <p
        className={`italic text-center ${!size ? 'text-sm' : size} ${resolveFontColor(getPhaseInfo()?.color)}`}>
            ´´{getPhaseInfo()?.description}´´
    </p>;
}