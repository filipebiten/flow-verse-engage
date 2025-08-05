import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus, Trash2} from "lucide-react";
import React from "react";

export const ListItems = (title, items, type, icon, onDelete, onAdd) => (
    <Card className='h-[35em]'>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                    {icon}
                    <p className='font-bold'>{title} ({items.length})</p>
                </div>
                <Button className='bg-green-700 hover:bg-green-500' onClick={onAdd}>
                    <Plus className="w-4 h-4 mr-2"/>
                    Adicionar {title}
                </Button>
            </CardTitle>
        </CardHeader>
        <CardContent>
            {items.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">Nenhum item cadastrado</p>
            ) : (
                <div className="space-y-2 overflow-y-auto">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                            {
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-20 h-20 rounded-md object-cover"
                                />
                            }
                            <div className="flex-1">
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-gray-600">{item.description}</p>
                                <div className="flex gap-2 mt-1">
                                    <Badge className='bg-green-500' variant="secondary">+{item.points} pts</Badge>
                                    {item.period && <Badge className='bg-blue-500' variant="outline">{item.period}</Badge>}
                                    {item.school && <Badge className='bg-yellow-500' variant="outline">{item.school}</Badge>}
                                </div>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onDelete(item.id, type)}
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