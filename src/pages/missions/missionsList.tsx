import { useState } from "react";
import { Mission } from "./Missions";
import { differenceInDays, endOfDay } from "date-fns";
import FilterButtons from "./filterButtons";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { definePeriodBadgeColor } from "@/helpers/colorHelper";
import { PeriodFilter } from "./periodFilter";

const MissionsList = ({
    items,
    type,
    title,
    icon,
    emptyMessage,
    completedItems,
    setCurrentSubmitingMission,
    setShowCompleteMissionDialog,
    currentSubmitingMission
}) => {

    const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
    const [periodFilter, setPeriodFilter] = useState<"all" | "diário" | "semanal" | "mensal" | "semestral" | "anual" | "especial">("all");

    const isCompleted = (item: Mission) => {
        const missionCompletions = completedItems.filter(i => i.mission_id === item.id);

        if (missionCompletions.length === 0) 
            return false;

        missionCompletions.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
        const latestCompletion = missionCompletions[0];

        if (!latestCompletion.period || latestCompletion.period.toLowerCase() === "especial") {
            return true;
        }

        const now = new Date();
        const completedAt = new Date(latestCompletion.completed_at);
        const days = differenceInDays(now, completedAt);

        switch (latestCompletion.period.toLowerCase()) {
        case "diário": return now <= endOfDay(completedAt);
        case "semanal": return days <= 6;
        case "mensal": return days <= 29;
        case "semestral": return days <= 179;
        case "anual": return days <= 364;
        default: return false;
        }
    };

    const matchesPeriod = (item: Mission) => {
        if (periodFilter === "all") return true;

        return item.period?.toLowerCase() === periodFilter.toLowerCase();
    };

    const filteredItems = items.filter(item => {
        const completed = isCompleted(item);

        if (filter === "completed" && !completed) return false;
        if (filter === "pending" && completed) return false;

        if (!matchesPeriod(item)) return false;

        return true;
    });

    return (
        <div>
            <div className="flex justify-between"> 
                <FilterButtons 
                    value={filter}
                    onChangeFilter={setFilter}
                />
                {type === 'missions' && (
                    <PeriodFilter
                        onChange={(value) => setPeriodFilter(value)}
                    />
                )}
            </div>
            {filteredItems.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{emptyMessage}</p>
            ) : (
                <div className="space-y-3">
                {filteredItems.map(item => {
                    const completed = isCompleted(item);
                    return (
                        <div
                            key={item.id}
                            className={`border rounded-lg transition-all flex-1 items-center group: cursor-default ${isCompleted(item) ? 'bg-green-50 border-green-200' : 'bg-white hover:shadow-md'}`}
                        >
                            <div className="p-4 flex items-center justify-between">
                            {title === 'Livros' && (
                                <img src={item?.image_url} alt={item.name} className="w-20 h-20 mr-4 rounded-md object-cover" />
                            )}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{item.name}</h3>
                                {isCompleted(item) && <CheckCircle className="w-5 h-5 text-green-600" />}
                                </div>
                                <p className="text-sm text-gray-600 mb-2 pr-1">{item.description}</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                <Badge className='bg-green-500 hover:bg-green-500 text-white' variant="secondary">+{item.points} Pontos</Badge>
                                {item.period && <Badge className={`hover:${definePeriodBadgeColor(item.period)} ${definePeriodBadgeColor(item.period)}`} variant="default">{item.period[0].toUpperCase() + item.period.slice(1)}</Badge>}
                                {item.school && <Badge className="bg-blue-900 text-white">{item.school}</Badge>}
                                </div>
                            </div>
                            <Button
                                onClick={() => {
                                    setCurrentSubmitingMission(item);
                                    setShowCompleteMissionDialog(true)
                                }}
                                disabled={isCompleted(item) || currentSubmitingMission?.id === item.id}
                                variant={isCompleted(item) ? "secondary" : "default"}
                                className={isCompleted(item) ? "secondary" : "bg-green-600 hover:bg-green-400"}
                                size="sm"
                            >
                                {isCompleted(item) ? "Concluído" : "Completar"}
                            </Button>
                            </div>
                        </div>
                    );
                })}
                </div>
            )}
        </div>
    );
};

export default MissionsList;