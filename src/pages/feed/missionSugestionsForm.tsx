import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus} from "lucide-react";
import React, {useState} from "react";
import {supabase} from "@/integrations/supabase/client.ts";
import {useToast} from "@/hooks/use-toast.ts";

export const MissionSugestionsForm = ({open, onOpenChange}) => {
    const [sending, setSending] = useState(false);
    const [form, setForm] = useState({mission_description: ''})
    const { toast } = useToast();

    async function handleSubmitMissionSugestion() {

        if(form.mission_description === ""){
            toast({
                title: "Erro",
                description: "Insira pelo menos a descrição.",
                variant: "destructive",
                className: 'bg-red-500'
            });
            return;
        }

        const {data, error} = await supabase
            .from("mission_sugestion")
            .insert({...form})
            .select();

        if(error){
            toast({
                title: "Erro",
                description: "Erro ao Inserir sugestão.",
                variant: "destructive",
                className: 'bg-red-500'
            });
        }
        toast({
            title: "Sucesso",
            description: "Sugestão enviada com sucesso.",
            variant: "destructive",
            className: 'bg-green-500'
        });
        onOpenChange(false);

    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Sugerir Missões</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Textarea
                            id={'mission_description'}
                            onChange={(e) => setForm({...form, mission_description: e.target.value})}
                            placeholder={'Descreva a missão'}
                        />
                    </div>
                    <Button disabled={sending}
                            onClick={async () => {
                                setSending(true);
                                await handleSubmitMissionSugestion();
                                setSending(false);
                            }}
                            className="w-full bg-green-700 hover:bg-green-500">
                        <Plus className="w-4 h-4 mr-2"/>
                        Enviar Sugestão
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
}