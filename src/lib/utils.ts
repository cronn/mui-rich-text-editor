import type { UseFormGetValues, UseFormTrigger } from "react-hook-form";
import {
  useForm,
  type Control,
  type ControllerRenderProps,
  type DefaultValues,
  type FieldPathByValue,
  type FieldValues,
  type Message,
} from "react-hook-form";
import type { FieldRegistration } from "../components/RichTextControl";
import type { IconButtonProps } from "@mui/material";

export type Align = "left" | "center" | "right";

export function getToolbarButtonColor(
  active: boolean,
): IconButtonProps["color"] {
  return active ? "primary" : "default";
}

export type Nullable<T> = T | null | undefined;

export function controlledValue(value: Nullable<unknown>): string {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value.toString();
  }

  return "";
}

export function isDefined<T>(value: T): value is NonNullable<T> {
  return value !== null && typeof value !== "undefined";
}

export function isUndefined(value: unknown): value is undefined | null {
  return !isDefined(value);
}

export type UseControllerHook<
  TFormValues extends FieldValues,
  TProps = unknown,
> = (props: TProps) => {
  field: ControllerRenderProps<TFormValues>;
  register: () => FieldRegistration;
};

type FormValue = string | number | boolean | Date;
type EmptyFormValue = "";

export type FormInputValues<TFieldValues extends FieldValues> = {
  [TFieldName in keyof TFieldValues]-?: TFieldValues[TFieldName] extends null
    ? TFieldValues[TFieldName]
    : TFieldValues[TFieldName] extends FormValue | undefined
      ? NonNullable<TFieldValues[TFieldName]> | EmptyFormValue
      : TFieldValues[TFieldName] extends object
        ? FormInputValues<TFieldValues[TFieldName]>
        : TFieldValues[TFieldName];
};

export interface CustomFormControlProps<
  TFormValues extends FieldValues,
  TFieldValue = unknown,
> extends RegisterFieldProps<TFormValues, TFieldValue> {
  label: string;
  helperText?: string;
  hideHelperText?: boolean;
  disabled?: boolean;
}

export interface RegisterFieldProps<
  TFormValues extends FieldValues,
  TFieldValue = unknown,
> {
  control: Control<TFormValues>;
  name: FieldPathByValue<TFormValues, TFieldValue>;
  rules?: CustomValidationRules;
}

export interface CustomValidationRules {
  required?: Message;
}

export interface UseCustomFormProps<TFieldValues extends FieldValues> {
  defaultValues?: DefaultValues<TFieldValues>;
}

export function useCustomForm<TFormValues extends FieldValues>(
  props: UseCustomFormProps<TFormValues>,
): {
  registerField: <TFieldValue = unknown>(
    path: FieldPathByValue<TFormValues, TFieldValue>,
    rules?: CustomValidationRules,
  ) => RegisterFieldProps<TFormValues, TFieldValue>;
  control: Control<TFormValues>;
  getValues: UseFormGetValues<TFormValues>;
  trigger: UseFormTrigger<TFormValues>;
} {
  const { control, getValues, trigger } = useForm<TFormValues>({
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: props.defaultValues,
  });

  function registerField<TFieldValue = unknown>(
    path: FieldPathByValue<TFormValues, TFieldValue>,
    rules?: CustomValidationRules,
  ): RegisterFieldProps<TFormValues, TFieldValue> {
    return {
      control,
      name: path,
      rules,
    };
  }

  return {
    registerField,
    control,
    getValues,
    trigger,
  };
}

export type UseCustomFormReturn<TFormValues extends FieldValues> = ReturnType<
  typeof useCustomForm<TFormValues>
>;
export type CustomFormRegister<TFormValues extends FieldValues> =
  UseCustomFormReturn<TFormValues>["registerField"];
