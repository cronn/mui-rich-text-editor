import { TextField } from "@mui/material";
import { OutlinedInputProps } from "@mui/material/OutlinedInput";
import { ChangeEvent, FocusEvent, KeyboardEventHandler, Ref } from "react";
import { FieldValues } from "react-hook-form";

import { LoadingAdornment } from "./LoadingAdornment";
import { NativeInputProps, UseControllerHook, getNativeInputProps } from "./utils";
import { CustomFormControlProps } from "./utils";
import { isDefined } from "./utils";
import { controlledValue } from "./utils";

function getMuiInputProps(props: TextInputProps): Partial<OutlinedInputProps> | undefined {
    const { loading, monospace } = props;

    if (loading === undefined && monospace === undefined) {
        return undefined;
    }

    return {
        ...(monospace && { style: { fontFamily: "monospace" } }),
        ...(loading !== undefined && { endAdornment: <LoadingAdornment loading={loading} /> }),
    };
}

export type TextControlProps<TFormValues extends FieldValues> = CustomFormControlProps<TFormValues> & TextInputProps;

type TextInputProps = NativeInputProps & {
    multiline?: boolean;
    rows?: number;
    maxRows?: number;
    monospace?: boolean;
    formatValue?: (value: string) => string;
    formatDisplayedValue?: (value: string) => string;
    loading?: boolean;
    setCursorPosition?: (element: (EventTarget & HTMLInputElement) | (EventTarget & HTMLTextAreaElement)) => void;
    onFocus?: (element: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onKeyUp?: KeyboardEventHandler<HTMLInputElement> | undefined;
    inputRef?: Ref<HTMLInputElement> | undefined;
    disableTrimOnBlur?: boolean;
};

export function TextControl<TFormValues extends FieldValues>(props: TextControlProps<TFormValues> & { useController: UseControllerHook<TFormValues> }) {
    const { field, register } = props.useController(props);

    const nativeInputProps = getNativeInputProps(props);
    const muiInputProps = getMuiInputProps(props);

    function formatValue(value: string) {
        return isDefined(props.formatValue) ? props.formatValue(value) : value;
    }

    function formatDisplayedValue(value: string) {
        return isDefined(props.formatDisplayedValue) ? props.formatDisplayedValue(value) : value;
    }

    function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (isDefined(props.setCursorPosition)) {
            props.setCursorPosition(event.target);
        }
        field.onChange(formatValue(event.target.value));
    }

    function handleBlur(event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const value = props.disableTrimOnBlur ? event.target.value : event.target.value.trim();
        field.onChange(formatValue(value));
        field.onBlur();
    }

    return (
        <TextField
            {...register()}
            value={formatDisplayedValue(controlledValue(field.value))}
            multiline={props.multiline}
            rows={props.rows}
            maxRows={props.maxRows}
            inputProps={nativeInputProps}
            InputProps={muiInputProps}
            fullWidth
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={props.onFocus}
            onKeyUp={props.onKeyUp}
            onSelect={(e) => {
                if (isDefined(props.setCursorPosition)) {
                    props.setCursorPosition(e.target as HTMLInputElement | HTMLTextAreaElement);
                }
            }}
            inputRef={props.inputRef}
        />
    );
}
