import { useForm } from "react-hook-form";
import { createRichTextController } from "./createRichTextController";

export interface ExampleFormValues {
  content: string;
}

export function useExampleForm(required?: string) {
  const { control, handleSubmit } = useForm<ExampleFormValues>({
    defaultValues: { content: "" },
  });

  const useContentController = createRichTextController(control, "content", {
    required,
  });

  return {
    handleSubmit,
    useContentController,
  };
}
