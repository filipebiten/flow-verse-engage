import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import React from "react";

type CreateNewDevotionalProps = {
    date?: Date,
    data?: any,
    editMode: boolean,
    onSave?: () => void,
    onUpdate?: () => void,
}

export default function CreateNewDevotional({ date, data, editMode, onSave, onUpdate }: CreateNewDevotionalProps) {
    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");

    React.useEffect(() => {
        if (editMode && data) {
            setTitle(data.title);
            setContent(data.text);
        }
    }, [editMode, data])

    const updateDevotional = async (devotionalDate) => {
        const { error } = await supabase
            .from("devotionals")
            .update({
                title: title,
                text: content,
            })
            .eq('devotional_date', devotionalDate);

        if (error) {
            toast({
                title: "Erro ao atualizar devocional",
                description: `Ocorreu um erro ao atualizar o devocional: ${error.message}`,
                className: "bg-red-600",
            });

            return;
        }

        toast({
            title: "Sucesso!",
            description: `Devocional atualizado com sucesso para a data ${devotionalDate}`,
            className: "bg-green-600",
            variant: "destructive"
        });
    }
    
    const createNewDevotional = async (devotionalDate) => {
        const { error } = await supabase
            .from("devotionals")
            .insert({
                devotional_date: devotionalDate,
                title: title,
                text: content,
            });

        if (error) {
            toast({
                title: "Erro ao criar devocional",
                description: `Ocorreu um erro ao criar o devocional: ${error.message}`,
                className: "bg-red-600",
            });

            return;
        }

        toast({
            title: "Sucesso!",
            description: `Devocional criado com sucesso para a data ${devotionalDate}`,
            className: "bg-green-600",
            variant: "destructive"
        });
    }
    
    const handleSave = async () => {
        const devotionalDate = date
            ? new Date(date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0];

        if(editMode) {
            updateDevotional(devotionalDate);
            if (onUpdate)
                onUpdate();
        } else {
            createNewDevotional(devotionalDate);
            if (onSave)
                onSave();
        }

        setContent("");
    };

    return (
    <div className="grid w-full gap-2">
        <Input
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
            rows={20}
            placeholder="No princípio Deus criou os céus e a terra..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
        />
        <Button
            className="bg-green-700"
            onClick={handleSave}
        >
            Salvar Devocional
        </Button>
    </div>
    );
}