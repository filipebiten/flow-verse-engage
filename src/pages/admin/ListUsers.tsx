import { Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { User } from "lucide-react"; // Apenas o ícone User
import React, {useEffect, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {supabase} from "@/integrations/supabase/client.ts";
import { useToast } from "@/hooks/use-toast";
import {Input} from "@/components/ui/input.tsx";
// import UserProfile from "@/pages/UserProfile.tsx"; // Comentado, pois não está sendo usado diretamente aqui
import {PhaseBadge} from "@/components/PhaseBadge.tsx";

// Defina uma interface para o tipo de usuário retornado pelo Supabase
interface UserProfile {
    id: string;
    name: string;
    description?: string;
    image_url?: string;
    points?: number;
    period?: string;
    school?: string;
    gender?: string; // Adicionado campo de gênero
    pgm_number?: string;
    email?: string;
    whatsapp?: string;
    birth_date?: string;
    participates_flow_up?: boolean;
    participates_irmandade?: boolean;
    pgm_role?: string;
    phase?: string;
}

function ListUsers(){

    const { toast } = useToast();
    const [ query, setQuery ] = useState<string>('');

    const { data, isPending, mutateAsync } = useMutation<UserProfile[], Error, { query: string }>({
        mutationFn: async ({ query }) => {
            try {
                let dbQuery = supabase.from('profiles').select('*');

                if (query.toLowerCase().includes('pgm')) {
                    dbQuery = dbQuery.or(`pgm_number.ilike.%${query.replace('pgm', '').trim()}%`)
                } else if (query) {
                    dbQuery = dbQuery.or(`name.ilike.%${query}%, phase.ilike.%${query}%, email.ilike.%${query}%, pgm_role.ilike.%${query}%, gender.ilike.%${query}%`);
                }

                const { error, data } = await dbQuery;

                if (error) {
                    throw error;
                }
                console.log("Dados da pesquisa:", data);
                return data as UserProfile[];
            }catch (e: any){
                console.error("Erro na mutação/pesquisa:", e);
                return [];
            }

        },
        onError: (error) => {
            toast({ title: "Erro", description: `Erro ao realizar pesquisa: ${error.message}. Tente novamente daqui a pouco.`, variant: "destructive" });
        },
    });

    useEffect(() => {
        const handler = setTimeout(() => {
            mutateAsync({ query });
        }, 300);
        return () => {
            clearTimeout(handler);
        };
    }, [query, mutateAsync]);

    function genderFormat(gender: string) {
        return gender.toLowerCase() == 'masculino' ? 'bg-blue-200' : 'bg-red-200';
    }

    return (
        <>
            <Card className='flex flex-col flex-1 max-h-[40vh] pb-2'>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <User></User> {/* Ícone User mantido para o título do card */}
                            <p className='font-bold'>Usuários ({data ? data.length : 0})</p>
                        </div>
                    </CardTitle>
                    <Input
                        placeholder="Buscar usuários por nome, pgm, gênero, fase, email, função no pgm..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1"
                    />
                </CardHeader>
                <CardContent className='space-y-4 overflow-y-auto flex-1'>
                    {isPending ? (
                        <p className="text-center text-muted-foreground py-4">Carregando usuários...</p>
                    ) : (data && data.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">Nenhum usuário cadastrado</p>
                    ) : (
                        <div className="space-y-2">
                            {data && data.map((user: UserProfile) => ( // Usando a interface UserProfile
                                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-all duration-200"> {/* Estilização aprimorada */}
                                    {user.profile_photo_url ? (
                                        <img
                                            src={user.profile_photo_url}
                                            alt={user.name}
                                            className="w-40 h-40 rounded-full object-cover mr-4 border-2 border-blue-300" // Imagem circular com borda
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl font-semibold mr-4 border-2 border-blue-300"> {/* Fallback circular */}
                                            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                        </div>
                                    )}
                                    <div
                                        className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1"> {/* Layout em grid para informações */}
                                        <h3 className="font-semibold text-lg text-gray-800 col-span-full">{user.name}</h3>

                                        <div className={`flex items-center gap-1 text-sm text-gray-600`}>
                                            <Badge variant="outline" className={`${genderFormat(user.gender)}`}>Gênero: {user.gender ?? '?'}</Badge>
                                        </div>

                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <Badge variant="outline"
                                                   className="bg-gray-100 text-gray-700">PGM: {user.pgm_number ?? '?'}</Badge>
                                        </div>

                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <Badge variant="outline"
                                                   className="bg-gray-100 text-gray-700">Email: {user.email ?? '?'}</Badge>
                                        </div>

                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <Badge variant="outline"
                                                   className="bg-gray-100 text-gray-700">Whatsapp: {user.whatsapp ?? '?'}</Badge>
                                        </div>

                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <Badge variant="outline"
                                                   className="bg-gray-100 text-gray-700">Nascimento: {user.birth_date ?? '?'}</Badge>
                                        </div>

                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <Badge variant="outline"
                                                   className="bg-gray-100 text-gray-700">Função: {user.pgm_role ?? '?'}</Badge>
                                        </div>

                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <Badge variant="outline" className="bg-gray-100 text-gray-700">Participa do
                                                flow
                                                up: {user.participates_flow_up === true ? 'Sim' : user.participates_flow_up === false ? 'Não' : '?'}</Badge>
                                        </div>

                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <Badge variant="outline" className="bg-gray-100 text-gray-700">Participa da
                                                irmandade: {user.participates_irmandade === true ? 'Sim' : user.participates_irmandade === false ? 'Não' : '?'}</Badge>
                                        </div>

                                        {/* Badges de pontos e fase */}
                                        <div className="flex items-center gap-2 mt-2 col-span-full ">
                                            {typeof user.points === 'number' && (
                                                <Badge
                                                    className='bg-green-600 text-white font-bold px-3 py-1 rounded-full shadow-sm hover:bg-green-600'
                                                    variant="secondary">
                                                    +{user.points} pts
                                                </Badge>
                                            )}
                                            {user.phase && <PhaseBadge userPhase={user.phase}></PhaseBadge>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </>
    );

}

export default ListUsers;
