import {Badge} from "@/components/ui/badge.tsx";
import { usePhases } from "@/contexts/phaseContext";
import resolvePhaseColor from "@/utils/colorUtil";

interface UserPhaseProps {
    phaseName: string;
}

export function PhaseBadge({ phaseName } : UserPhaseProps) {
    
    const { phases, loading } = usePhases();
    
    const getPhaseInfo = () => {
        return phases.find(phase => phase.name === phaseName);
    };

    if (loading) {
        return (
            <></>
        );
    }

    const color = getPhaseInfo()?.color;

    return (
        <div className="flex items-center space-x-3 mt-1">
            <Badge 
                className={`${resolvePhaseColor(color)} text-white flex gap-1 border-white`}>
                <span className="text-lg">{getPhaseInfo()?.icon}</span>
                {phaseName}
            </Badge>
        </div>
    )
}