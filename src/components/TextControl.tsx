import { TextField } from "@mui/material";
import type { ChangeEvent, FocusEvent, ReactElement } from "react";
import type { FieldValues } from "react-hook-form";
import type { UseControllerHook, CustomFormControlProps } from "../lib/utils";
import { controlledValue } from "../lib/utils";

export type TextControlProps<TFormValues extends FieldValues> =
  CustomFormControlProps<TFormValues>;

export function TextControl<TFormValues extends FieldValues>(
  props: TextControlProps<TFormValues> & {
    useController: UseControllerHook<TFormValues>;
  },
): ReactElement {
  const { field, register } = props.useController(props);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    field.onChange(event.target.value);
  }

  function handleBlur(
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    field.onChange(event.target.value.trim());
    field.onBlur();
  }

  return (
    <TextField
      {...register()}
      value={controlledValue(field.value)}
      fullWidth
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}
