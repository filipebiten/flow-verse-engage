import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import React, {useState} from "react";

export function CompleteMissionDialog({open, setOpen, onCancel, onConfirm}: {
     open: boolean;
     setOpen: (open: boolean) => void;
     onCancel: () => void;
     onConfirm: () => void;
}) {

    const [ buttonClicked, setButtonClicked ] = useState(false);

    return(
        <>
            <Dialog open={open} onOpenChange={() => {setOpen(false); onCancel()}}  >
                <DialogContent
                    className="sm:max-w-[425px]"
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Confirmar Ação</DialogTitle>
                    </DialogHeader>
                    <p className="text-2xl">Deseja confirmar esta missão?</p>
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