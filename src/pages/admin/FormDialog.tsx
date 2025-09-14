import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus} from "lucide-react";
import React, {useState} from "react";

export const FormDialog = ({title, form, setForm, onSubmit, fields, open, onOpenChange}) => {
    const [sending, setSending] = useState(false);

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
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
                                ) : field.type === 'select' ? (
                                    <select
                                        id={field.key}
                                        value={form[field.key]}
                                        onChange={(e) => setForm({...form, [field.key]: e.target.value})}
                                        className="w-full p-2 border rounded-md bg-white"
                                    >
                                        {field.options.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : field.type === "file" ? (
                                    <Input
                                        id={field.key}
                                        type={field.type}
                                        onChange={field.onChange}
                                    />
                                ) : (
                                    <Input
                                        id={field.key}
                                        type={field.type}
                                        value={form[field.key]}
                                        onChange={(e) => setForm({...form, [field.key]: e.target.value})}
                                        placeholder={field.placeholder}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <Button disabled={sending}
                            onClick={async () => {
                                setSending(true);
                                await onSubmit();
                            }}
                            className="w-full bg-green-700 hover:bg-green-500">
                        <Plus className="w-4 h-4 mr-2"/>
                        Adicionar {title}
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
}