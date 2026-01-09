import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus} from "lucide-react";
import {useEffect, useState} from "react";
import { set } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Mission } from "../missions/Missions";

export const FormDialog = ({title, form, setForm, onSubmit, fields, open, onOpenChange}) => {
    const [sending, setSending] = useState(false);
    
    const { data, isLoading, error } = useQuery({
        queryKey: ['get_missions'],
        staleTime: 0,
        queryFn: async () => {
            const {data: missions, error: availableBadgesError} = await supabase
                .from('missions')
                .select('*');

            const m = missions.map((mission: Mission) => ({
                id: mission.id,
                description: mission.description
            }))

            return [
                {
                    id: '',
                    description: 'Selecione uma missão'
                },
                ...m
            ]
        }
    })

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            period: form.mission_reference ? 'sequencia' : 'diário',
        }));
    }, [form.mission_reference]);

    return (
        <>
            <Dialog 
                open={open} 
                onOpenChange={onOpenChange}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {fields.map((field) => (
                            <div key={field.key} className="space-y-2">
                                <Label htmlFor={field.key}>{field.label}</Label>
                                {field.type === 'textarea' ? (
                                    <Textarea
                                        id={field.key}
                                        value={form[field.key]}
                                        onChange={(e) => setForm({...form, [field.key]: e.target.value})}
                                        placeholder={field.placeholder}
                                    />
                                ) : field.type === 'select' && field.key !== 'mission_reference' ? (
                                    <select
                                        id={field.key}
                                        value={form[field.key]}
                                        disabled={form.mission_reference}
                                        onChange={(e) => setForm({...form, [field.key]: e.target.value})}
                                        className="w-full p-2 border rounded-md bg-white"
                                    >
                                            {field.options.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                    </select>
                                ) : field.type === 'select' &&  field.key === 'mission_reference' ? (
                                    isLoading ? (
                                        <p>Carregando Missões</p>
                                    ) : error ? (
                                        <p>Erro ao carregar missões</p>
                                    ) : (
                                        <select
                                            id={field.key}
                                            value={form[field.key]}
                                            onChange={(e) => setForm({...form, [field.key]: e.target.value})}
                                            className="w-full p-2 border rounded-md bg-white"
                                        >
                                            {data.map((m) => (
                                                <option key={m.id} value={m.id} defaultValue={'Selecione uma missão'}>
                                                    {m.description}
                                                </option>
                                            ))}
                                        </select>
                                    )
                                ) : field.type === "file" ? (
                                    <Input
                                        id={field.key}
                                        type={field.type}
                                        onChange={field.onChange}
                                    />
                                ) : (
                                    <Input
                                        id={field.key}
                                        disabled={!form.mission_reference && field.key === 'sequencia'}
                                        type={field.type}
                                        value={form[field.key]}
                                        onChange={(e) => {
                                            if (field.key === 'sequencia'){
                                                if (Number(e.target.value ?? 0) > 0){
                                                    setForm({...form, [field.key]: e.target.value})
                                                }
                                                else {
                                                    setForm({...form, [field.key]: 0})
                                                }
                                            }else{
                                                setForm({...form, [field.key]: e.target.value})
                                            }
                                        }}
                                        placeholder={field.placeholder}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <Button 
                        disabled={sending}
                        onClick={async () => {
                            setSending(true);
                            await onSubmit();
                        }}
                        className="w-full bg-green-700 hover:bg-green-500"
                    >
                        <Plus className="w-4 h-4 mr-2"/>
                        Adicionar {title}
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
}