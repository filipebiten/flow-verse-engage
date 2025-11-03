import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Cake} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import React from "react";
import {useQuery} from "@tanstack/react-query";
import {supabase} from "@/integrations/supabase/client.ts";

export default function BirthdayBoard({openUserProfile}) {

    const { data = [], isLoading }  = useQuery({
        queryKey: ['birthday'],
        staleTime: 0,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, name, birth_date, profile_photo_url');

            if (!error) {
                const today = new Date();

                return data
                    .map((p) => {
                        const birth = new Date(p.birth_date);
                        const next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());

                        if (next < today) next.setFullYear(today.getFullYear() + 1);

                        return {
                            ...p,
                            nextBirthday: next,
                            month: birth.toISOString().slice(5, 7),
                            day: birth.toISOString().slice(8, 10),
                        };
                    })
                    .sort((a, b) => a.nextBirthday - b.nextBirthday)
                    .slice(0, 10);
            }
            return [];
        }
    });

    return (
        <>
            <Card className="overflow-hidden transition-all duration-300 bg-card">
                <CardHeader className="pb-3 border-b border-border/70">
                    <CardTitle className="flex items-center text-lg font-bold text-primary">
                        <Cake className="w-5 h-5 mr-3 text-black-500 fill-pink-500/80"/>
                        <p className="text-lg font-bold text-pink-600">Próximos Aniversários</p>
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-1 p-4 h-[450px] overflow-y-auto">
                    {data.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-6 italic">
                            Parece que não tem bolo por vir... 🎂
                        </p>
                    )}

                    {data.map((user, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-xl transition-all duration-200
                                hover:bg-accent/50 hover:shadow-sm"
                        >
                            <div className="flex items-center space-x-4">
                                <Avatar
                                    className="w-10 h-10 ring-2 ring-primary/20 cursor-pointer hover:ring-primary transition-all duration-200"
                                    onClick={() => openUserProfile(user.id)}
                                >
                                    <AvatarImage src={user.profile_photo_url || ''} />
                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-base">
                                        {user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div
                                    className={`flex flex-col ${
                                        user.name.includes(' ') ? 'break-words' : 'break-all'
                                    }`}
                                >
                                    <span
                                        className="font-semibold text-base text-foreground cursor-pointer
                                                 hover:text-primary transition-colors"
                                        onClick={() => openUserProfile(user.id)}
                                    >
                                      {user.name}
                                    </span>
                                    <span className="text-muted-foreground/90 text-lg">
                                        {user.day}/
                                        {user.month}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </>
    )
}