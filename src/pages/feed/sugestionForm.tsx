import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus} from "lucide-react";
import React, {useState} from "react";
import {supabase} from "@/integrations/supabase/client.ts";
import {useToast} from "@/hooks/use-toast.ts";

export const SugestionForm = ({open, onOpenChange}) => {
    const [sending, setSending] = useState(false);
    const [form, setForm] = useState({sugestion: ''})
    const { toast } = useToast();

    async function handleSubmitSugestion() {

        if(form.sugestion === ""){
            toast({
                title: "Erro",
                description: "Insira pelo menos a sugestão.",
                variant: "destructive",
                className: 'bg-red-500'
            });
            return;
        }

        const {data, error} = await supabase
            .from("sugestion")
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
                        <DialogTitle>Reportar Bug ou Sugerir Funções</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Textarea
                            id={'sugestion'}
                            onChange={(e) => setForm({...form, sugestion: e.target.value})}
                            placeholder={'Sugestão ou Reportar Bugs'}
                        />
                    </div>
                    <Button disabled={sending}
                            onClick={async () => {
                                setSending(true);
                                await handleSubmitSugestion();
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