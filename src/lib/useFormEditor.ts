import type {
  FieldValues,
  FieldPath,
  ControllerRenderProps,
} from "react-hook-form";
import type { CustomEditor } from "./useCustomEditor";
import { useCustomEditor } from "./useCustomEditor";
import { controlledValue } from "./utils";
import type { Editor } from "@tiptap/core";

export function useFormEditor<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(
  field: ControllerRenderProps<TFieldValues, TName>,
  disabled?: boolean,
): CustomEditor {
  return useCustomEditor({
    content: controlledValue(normalizeValue(field.value)),
    onUpdate: ({ editor }: { editor: Editor }) => {
      field.onChange(normalizeValue(editor.getHTML()));
    },
    disabled: disabled,
  });
}

function normalizeValue(value: string | undefined): string {
  return value === "<p></p>" ||
    value === '<p><br class="ProseMirror-trailingBreak"></p>' ||
    value === undefined
    ? ""
    : value;
}
