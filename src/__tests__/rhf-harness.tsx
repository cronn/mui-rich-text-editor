import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import type {
  DefaultValues,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { useController, useForm } from "react-hook-form";

import type { FieldRegistration } from "../components/RichTextControl";
import type {
  CustomFormControlProps,
  RegisterFieldProps,
  UseControllerHook,
} from "../lib/utils";

/**
 * A real `useController`-based implementation of the `UseControllerHook`
 * dependency-injection contract expected by `RichTextControl`/`TextControl`.
 * Exercises the actual react-hook-form integration rather than a hand mock.
 *
 * `UseControllerHook`'s `TProps` type parameter defaults to `unknown`, so a
 * function whose parameter is narrowed to `CustomFormControlProps<TFormValues>`
 * isn't structurally assignable to it (parameter contravariance). Since the
 * components in this library always pass their own props (which do satisfy
 * `CustomFormControlProps`) to the injected hook, this narrowing is safe in
 * practice; the assertion below documents and contains that assumption.
 */
function useControllerImpl<TFormValues extends FieldValues>(
  props: CustomFormControlProps<TFormValues>,
): {
  field: ReturnType<typeof useController<TFormValues>>["field"];
  register: () => FieldRegistration;
} {
  const { field, fieldState } = useController<TFormValues>({
    control: props.control,
    name: props.name,
    rules: props.rules,
  });

  function register(): FieldRegistration {
    return {
      inputRef: field.ref,
      label: props.label,
      required: props.rules?.required !== undefined,
      disabled: props.disabled ?? false,
      error: fieldState.invalid,
      helperText:
        props.hideHelperText === true
          ? undefined
          : (fieldState.error?.message ?? props.helperText),
    };
  }

  return { field, register };
}

/**
 * `UseControllerHook<TFormValues, TProps = unknown>` declares its `props`
 * parameter as `unknown` by default, which no concrete implementation can
 * satisfy without a cast (an implementation narrowing `props` to
 * `CustomFormControlProps<TFormValues>` is not structurally assignable to a
 * function required to accept literally `unknown`). This is a pre-existing
 * looseness in the library's own DI type contract, not something introduced
 * by this test utility. Components always pass their own props (which do
 * satisfy `CustomFormControlProps`) to the injected hook at runtime, so this
 * cast is safe in practice; it's exposed as a small typed helper so each
 * call site can instantiate it for its own `TFormValues`.
 */
export function useTestFormController<
  TFormValues extends FieldValues,
>(): UseControllerHook<TFormValues> {
  return useControllerImpl;
}

/**
 * `RichTextControlProps` (unlike `TextControlProps`) does *not* extend
 * `CustomFormControlProps` and so carries no `control`/`name`/`rules` props;
 * instead the consumer is expected to supply a `useController` hook that has
 * already been bound to a specific field's `control`/`name`/`rules` via
 * closure (a fully "pre-wired" DI hook, one per field). This factory builds
 * such a hook for tests, backed by the real `useController` from
 * react-hook-form.
 */
export function createBoundTestController<TFormValues extends FieldValues>(
  binding: RegisterFieldProps<TFormValues>,
): UseControllerHook<TFormValues> {
  function useBoundController(props: {
    label: string;
    helperText?: string;
    hideHelperText?: boolean;
    disabled?: boolean;
  }): {
    field: ReturnType<typeof useController<TFormValues>>["field"];
    register: () => FieldRegistration;
  } {
    const { field, fieldState } = useController<TFormValues>(binding);

    function register(): FieldRegistration {
      return {
        inputRef: field.ref,
        label: props.label,
        required: binding.rules?.required !== undefined,
        disabled: props.disabled ?? false,
        error: fieldState.invalid,
        helperText:
          props.hideHelperText === true
            ? undefined
            : (fieldState.error?.message ?? props.helperText),
      };
    }

    return { field, register };
  }

  return useBoundController;
}

interface RenderWithFormOptions<TFormValues extends FieldValues> {
  defaultValues?: DefaultValues<TFormValues>;
}

/**
 * Mounts `renderChildren` inside a component that calls the real RHF
 * `useForm()`, giving tests a live `control` plus access to `methods`
 * (getValues/trigger/formState/etc.) for assertions.
 */
export function renderWithForm<TFormValues extends FieldValues>(
  renderChildren: (methods: UseFormReturn<TFormValues>) => ReactElement,
  options: RenderWithFormOptions<TFormValues> = {},
): ReturnType<typeof render> & { methods: UseFormReturn<TFormValues> } {
  let capturedMethods: UseFormReturn<TFormValues> | undefined;

  function Harness(): ReactElement {
    const methods = useForm<TFormValues>({
      mode: "onTouched",
      reValidateMode: "onChange",
      defaultValues: options.defaultValues,
    });
    capturedMethods = methods;
    return renderChildren(methods);
  }

  const renderResult = render(<Harness />);

  if (!capturedMethods) {
    throw new Error(
      "Form methods were not captured; Harness did not render synchronously",
    );
  }

  return { ...renderResult, methods: capturedMethods };
}
