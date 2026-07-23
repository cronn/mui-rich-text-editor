import { useController } from "react-hook-form";
import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import type {
  FieldRegistration,
  UseControllerHook,
} from "@cronn/mui-rich-text-editor";

export function createRichTextController<TFormValues extends FieldValues>(
  control: Control<TFormValues>,
  name: FieldPath<TFormValues>,
  options?: Pick<RegisterOptions<TFormValues>, "required">,
): UseControllerHook<TFormValues> {
  return function useRichTextController(props): {
    field: ReturnType<typeof useController<TFormValues>>["field"];
    register: () => FieldRegistration;
  } {
    const { field, fieldState } = useController({
      control,
      name,
      rules: options,
    });

    return {
      field,
      register: (): FieldRegistration => ({
        inputRef: field.ref,
        label: props.label ?? "",
        required: options?.required !== undefined,
        disabled: props.disabled ?? false,
        error: fieldState.invalid,
        helperText: props.hideHelperText
          ? undefined
          : (fieldState.error?.message ?? props.helperText),
      }),
    };
  };
}
