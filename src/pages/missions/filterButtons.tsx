import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

interface FilterButtonsProps {
    value: string,
    onChangeFilter: (filter: "all" | "completed" | "pending") => void;
}

export default function FilterButtons({ onChangeFilter }: FilterButtonsProps) {
  const [selected, setSelected] = useState("all")

  return (
    <ButtonGroup className="mb-4">
      <Button
        size="sm"
        className={selected === "all" ? "bg-green-600 text-white hover:bg-green-700" : "hover:bg-gray-100"}
        variant={selected === "all" ? "default" : "outline"}
        onClick={() => {
            setSelected("all");
            onChangeFilter('all');
        }}
      >
        Todos
      </Button>

      <Button
        size="sm"
        className={selected === "completed" ? "bg-green-600 text-white hover:bg-green-700" : "hover:bg-gray-100"}
        variant={selected === "completed" ? "default" : "outline"}
        onClick={() => {
            setSelected("completed");
            onChangeFilter('completed');
        }}
      >
        Completos
      </Button>

      <Button
        size="sm"
        className={selected === "pending" ? "bg-green-600 text-white hover:bg-green-700" : "hover:bg-gray-100"}
        variant={selected === "pending" ? "default" : "outline"}
        onClick={() => {
            setSelected("pending");
            onChangeFilter('pending');
        }}
      >
        Para Completar
      </Button>
    </ButtonGroup>
  )
}
