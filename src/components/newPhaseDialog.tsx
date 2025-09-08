import React from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PhaseBadge } from "@/components/PhaseBadge.tsx";
import {PhasePhrase} from "@/components/PhasePhrase.tsx";

export default function NewPhaseDialog({open, setOpenDialog, currentPhaseName, newPhase}) {
    return (
        <Dialog open={open} onOpenChange={setOpenDialog} >
            <form>
                <DialogContent
                    className="sm:max-w-[425px] bg-white text-gray-800"
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle className="text-black">
                            Você está em uma nova fase! 🎉
                        </DialogTitle>
                        <DialogDescription className="text-black space-y-4 pt-6 pb-6 text-center">
                            <div className="flex items-center justify-center gap-1">
                                <PhaseBadge userPhase={currentPhaseName} />
                                <span className="mx-1">→</span>
                                <PhaseBadge userPhase={newPhase?.name} />
                            </div>
                            <div className="flex items-center justify-center gap-1">
                                <PhasePhrase size="text-xl" userPhase={newPhase}/>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                className="bg-green-700 text-white hover:bg-green-800"
                                variant="destructive">
                                Fechar
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}
