import { IMaskMixin } from "react-imask"
import { Input } from "@/components/ui/input"
import React from "react";

export const MaskedInput = IMaskMixin(({ inputRef, ...props }) => (
    <Input
        {...props}
        ref={inputRef as unknown as React.Ref<HTMLInputElement>}
    />
))
