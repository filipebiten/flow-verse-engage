import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import React, {useState} from "react";
import {Textarea} from "@/components/ui/textarea.tsx";
import { Label } from "@/components/ui/label"
import {Mission} from "@/pages/missions/Missions.tsx";

export function CompleteMissionDialog({open, setOpen, onCancel, onConfirm, mission, setMission}: {
     open: boolean;
     setOpen: (open: boolean) => void;
     onCancel: () => void;
     onConfirm: () => void;
     mission: Mission;
     setMission: (mission: (prev) => any) => void;
}) {

    const [ buttonClicked, setButtonClicked ] = useState(false);

    return(
        <>
            <Dialog open={open} onOpenChange={() => {setOpen(false); onCancel()}}  >
                <DialogContent
                    className="sm:max-w-[425px] group: select-none"
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle className="text-xl">Confirmar Missão</DialogTitle>
                    </DialogHeader>
                    <div className="grid w-full gap-3">
                        <Label htmlFor="message-2">Deixe um comentário sobre como foi a missão (Opcional e aparecerá no Feed).</Label>
                        <Textarea
                            className=""
                            id="comment"
                            value={mission?.comment}
                            onChange={(e) =>
                                setMission((prev) => ({
                                ...prev,
                                comment: e.target.value,
                            }))}
                            placeholder="Comentário"
                        />
                    </div>
                    <div
                        className="flex justify-between">
                        <Button
                            disabled={buttonClicked}
                            onClick={async () => {
                                setButtonClicked(true)
                                onCancel()
                                setOpen(false)
                                setButtonClicked(false)
                            }}
                            variant="outline"
                        >
                            Cancelar
                        </Button>
                        <Button
                            disabled={buttonClicked}
                            onClick={async () => {
                                setButtonClicked(true)
                                await onConfirm();
                                setButtonClicked(false)
                            }}
                            className="bg-green-700 hover:bg-green-500"
                        >
                            Confirmar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}