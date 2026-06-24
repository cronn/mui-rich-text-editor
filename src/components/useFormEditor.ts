import type { FieldValues } from "react-hook-form";
import type { FieldPath } from "react-hook-form/dist/types";
import type { ControllerRenderProps } from "react-hook-form/dist/types/controller";

import type { CustomEditor} from "./useCustomEditor";
import { useCustomEditor } from "./useCustomEditor";
import { controlledValue } from "./utils";

export function useFormEditor<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(
    field: ControllerRenderProps<TFieldValues, TName>,
    disabled?: boolean,
): CustomEditor {
    return useCustomEditor({
        content: controlledValue(normalizeValue(field.value)),
        onUpdate: ({ editor }) => {
            field.onChange(normalizeValue(editor.getHTML()));
        },
        disabled: disabled,
    });
}

function normalizeValue(value: string | undefined) {
    return value === "<p></p>" || value === '<p><br class="ProseMirror-trailingBreak"></p>' || value === undefined
        ? ""
        : value;
}
