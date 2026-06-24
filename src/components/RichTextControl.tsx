// lib/components/form/RichTextControl.tsx
import { Box, FormControl, FormHelperText } from "@mui/material";
import { EditorContent } from "@tiptap/react";
import type { JSX, Ref } from "react";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { FieldValues, RefCallBack } from "react-hook-form";

import { RichTextEditorWrapper } from "./RichTextEditorWrapper";
import { useFormEditor } from "./useFormEditor";
import type { UseControllerHook } from "./utils";
import { isDefined, isUndefined } from "./utils";
import { EditorToolbar, EditorToolbarProps } from "./EditorToolbar";

type EditorToolbarInjectedProps = Omit<EditorToolbarProps, "editor" | "disableLink" | "disableImageUpload">;

export interface RichTextControlProps<TFormValues extends FieldValues> extends EditorToolbarInjectedProps {
    label: string;
    helperText?: string;
    hideHelperText?: boolean;
    disabled?: boolean;
    disableLink?: boolean;
    disableImageUpload?: boolean;
}

export interface FieldRegistration {
    inputRef: RefCallBack;
    label: string;
    required: boolean;
    disabled: boolean;
    error: boolean;
    helperText?: string;
}

export interface RichTextControlHandle {
    forceSetValue: (value: string) => void;
}

function RichTextControlInner<TFormValues extends FieldValues>(
    props: RichTextControlProps<TFormValues> & { useController: UseControllerHook<TFormValues> },
    ref: Ref<RichTextControlHandle>,
) {
    const { field, register } = props.useController(props);
    const { error, helperText, required } = register();
    const editor = useFormEditor(field, props.disabled);
    const forceSetRef = useRef(false);

    useImperativeHandle(ref, () => ({
        forceSetValue: (value: string) => {
            forceSetRef.current = true;
            if (isDefined(editor) && !editor.isDestroyed) {
                editor.commands.setContent(value);
            }
            forceSetRef.current = false;
        },
    }));

    useEffect(() => {
        if (isDefined(field.value) && isDefined(editor) && !editor.isDestroyed) {
            if (editor.getText() === "" || forceSetRef.current) {
                editor.commands.setContent(field.value);
            }
        }
    }, [field.value, editor]);

    if (isUndefined(editor)) {
        return null;
    }

    const label = required ? `${props.label} *` : props.label;
    
    const { disableLink, disableImageUpload, useController, ...toolbarInjectedProps } = props;

    return (
        <FormControl {...register()} fullWidth disabled={props.disabled}>
            <RichTextEditorWrapper error={error}>
                <EditorToolbar
                    {...toolbarInjectedProps}
                    editor={editor}
                    disableLink={disableLink}
                    disableImageUpload={disableImageUpload}
                />
                <Box px={1} data-testid="editor-content">
                    <EditorContent editor={editor} />
                </Box>
            </RichTextEditorWrapper>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
}

export const RichTextControl = forwardRef(RichTextControlInner) as <TFormValues extends FieldValues>(
    props: RichTextControlProps<TFormValues> & {
        useController: UseControllerHook<TFormValues>;
        ref?: React.Ref<RichTextControlHandle>;
    },
) => JSX.Element;