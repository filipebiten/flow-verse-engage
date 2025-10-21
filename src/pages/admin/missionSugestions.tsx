import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Trash2, LampIcon} from "lucide-react";
import React from "react";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {supabase} from "@/integrations/supabase/client.ts";

export const MissionSugestions = () => {
    const queryClient = useQueryClient();

    const { data = [], isLoading }  = useQuery({
        queryKey: ['missions_sugestions'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('mission_sugestion')
                .select('*');

            if (error) {
                return [];
            }

            return data.map(i => {
                return {
                    id: i.id,
                    created_at: ((new Date(i.created_at)).toLocaleDateString('pt-BR', { timeZone: 'UTC' })),
                    mission_description: i.mission_description
                };
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const { error } = await supabase.from("mission_sugestion").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['missions_sugestions'] });
        }
    });

    if (isLoading) {
        return null;
    }

    return (
        <Card className='flex flex-col flex-1 max-h-[40vh] pb-2'>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                        <LampIcon />
                        <p className='font-bold'>Sugestões de Missões ({data.length})</p>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4 overflow-y-auto flex-1'>
                {data.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">Nenhum item cadastrado</p>
                ) : (
                    <div className="space-y-2">
                        {data.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                                <div className="flex-1">
                                    <h4 className="font-medium">{item.mission_description}</h4>
                                    <h5 className="font-medium text-sm text-muted-foreground">Sugerido em: {item.created_at}</h5>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deleteMutation.mutate(item.id)}
                                    disabled={deleteMutation.isLoading}
                                >
                                    <Trash2 className="w-4 h-4"/>
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
