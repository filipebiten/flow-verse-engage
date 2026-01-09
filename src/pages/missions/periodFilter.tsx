import { useState } from "react";
import { definePeriodBadgeColor } from "@/helpers/colorHelper";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const PERIODS = [
  { label: "Todos", value: "all" },
  { label: "Diário", value: "diário" },
  { label: "Semanal", value: "semanal" },
  { label: "Mensal", value: "mensal" },
  { label: "Semestral", value: "semestral" },
  { label: "Anual", value: "anual" },
  { label: "Especial", value: "especial" },
  { label: "Sequência", value: "sequencia" },
];

interface PeriodFilterProps {
  onChange: (period: string) => void;
}

export function PeriodFilter({ onChange }: PeriodFilterProps) {
    const [selected, setSelected] = useState("all");

    const handleValueChange = (newValue: string) => {
        setSelected(newValue);
        onChange(newValue);
    };

    return (
        <Select
            value={selected}
            onValueChange={handleValueChange}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o Período" />
            </SelectTrigger>
            <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Período</SelectLabel>
                        {PERIODS.map((p) => (
                            <SelectItem 
                                key={p.value} value={p.value}>
                                    {p.label}
                            </SelectItem>
                        ))}

                    </SelectGroup>
            </SelectContent>
        </Select>
    );
}
