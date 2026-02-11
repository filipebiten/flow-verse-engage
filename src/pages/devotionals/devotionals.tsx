import { LoadingComponent } from "@/components/LoadingComponent";
import { DatePickerSimple } from "@/components/sampleDatePicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";
import { resolvePhaseGradient } from "@/utils/colorUtil";
import { useQuery } from "@tanstack/react-query";
import { BookOpenIcon } from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CreateNewDevotional from "./createNewDevotional";
import remarkBreaks from "remark-breaks"
import rehypeRaw from 'rehype-raw';

export default function Devotionals() {

    const { profile } =  useUserProfile();
    
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    const [openNewDevotional, setOpenNewDevotional] = React.useState(false);

    const {data, isLoading} = useQuery({
        queryKey: ['get_devotional_date', date, openNewDevotional],
        staleTime: 0,
        queryFn: async () => {

            const {data: devotionals, error: devotionalError} = await supabase.from('devotionals')
                .select('*')
                .eq('devotional_date', date ? date.toISOString().split('T')[0] : null)
                .single()
            
            return devotionals;
        }
    })

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            <div className="max-w-6xl mx-auto space-y-6">
                <Card className="overflow-hidden">
                <div className={`bg-gradient-to-r ${resolvePhaseGradient("red")} p-6 text-white`}>
                    <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Devocionais</h1>
                    </div>
                    <div className="text-right">
                        <DatePickerSimple 
                            date={date} 
                            setDate={setDate} 
                            onChangeDate={() => {setOpenNewDevotional(false)}} 
                        />
                    </div>
                    </div>
                </div>
                { isLoading ? (
                    <>
                        <LoadingComponent></LoadingComponent>
                    </>
                ) : (
                    <CardContent className="p-6 overflow-y-scroll">
                    {data && !openNewDevotional ? (
                        <>
                            <div className="items-end flex justify-end mb-4">
                                <Button
                                    className="bg-green-700"
                                    onClick={() => setOpenNewDevotional(true)}
                                >
                                    Editar
                                </Button>
                            </div>
                            <h2 className="scroll-m-20 text-center border-b
                                pb-4 text-4xl text-gray-900 font-semibold tracking-tight">
                                {data.title}
                            </h2>
                            <div className="max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    p: ({ node, ...props }) => (
                                        <p className="whitespace-pre-wrap mb-4 min-h-[1rem]" {...props} />
                                    ),
                                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />,
                                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-4 mb-2" {...props} />,
                                }}
                            >
                                {data?.text?.replace(/\\n/g, '\n')}
                            </ReactMarkdown>
                        </div>
                        </>
                    ) : openNewDevotional ? (
                        <CreateNewDevotional 
                            editMode={data !== null} date={date} data={data} 
                            onUpdate={() => {
                                setOpenNewDevotional(false);
                            }}
                            onSave={() => {
                                setOpenNewDevotional(false);
                                
                            }}
                        ></CreateNewDevotional>
                    ) : (
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                <BookOpenIcon />
                                </EmptyMedia>
                                <EmptyTitle>Sem Devocionais para este dia</EmptyTitle>
                                <EmptyDescription />
                                <EmptyContent className="flex-row justify-center gap-2">
                                    {
                                        profile?.is_admin && (
                                            openNewDevotional ? (
                                                <CreateNewDevotional 
                                                    editMode={false} date={date} data={data} />
                                            ) : (
                                                <Button
                                                    className="bg-green-700"
                                                    onClick={() => setOpenNewDevotional(true)}
                                                >
                                                    Criar Devocional para Hoje
                                                </Button>
                                            )
                                        )
                                    }
                                </EmptyContent>
                            </EmptyHeader>
                        </Empty>
                    )}
                    </CardContent>
                )}
                </Card>
            </div>
            </div>
        </>
    )
}