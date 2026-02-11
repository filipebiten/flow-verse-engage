"use client"

import * as React from "react"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerSimpleProps {
  date: Date | undefined,
  setDate: (date: Date | undefined) => void,
  onChangeDate: () => void
}

export function DatePickerSimple({date, setDate, onChangeDate}: DatePickerSimpleProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Field className="mx-auto w-44">
      <FieldLabel htmlFor="date">Data do Devocional</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger 
            render={
                <Button 
                    variant="outline" 
                    id="date" 
                    className="justify-start font-normal text-black">{date ? date.toLocaleDateString() : "Selecione uma Data"}
                </Button>} />
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            locale={ptBR}
            fromDate={new Date(2026, 0, 1)}
            selected={date}
            defaultMonth={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              onChangeDate()
              setDate(date)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
