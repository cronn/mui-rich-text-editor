import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import type { LinkDialogFormValues } from "../components/LinkDialog";
import type { RichTextControlHandle } from "../components/RichTextControl";
import { RichTextControl } from "../components/RichTextControl";
import {
  createBoundTestController,
  createTestUseForm,
  renderWithForm,
  useTestFormController,
} from "./rhf-harness";

interface FormValues {
  content: string;
}

// `RichTextControl` renders a full `EditorToolbar` (including the link
// button), so its props always require a `useForm`/`useUrlFieldController`
// pair for the nested `LinkDialog`, even in tests that don't exercise linking.
function linkDialogProps() {
  return {
    useForm: createTestUseForm<LinkDialogFormValues>({ url: "" }),
    useUrlFieldController: useTestFormController<LinkDialogFormValues>(),
  };
}

describe("RichTextControl", () => {
  it("renders the given label", async () => {
    renderWithForm<FormValues>(({ control }) => (
      <RichTextControl
        label="Description"
        useController={createBoundTestController<FormValues>({
          control,
          name: "content",
        })}
        {...linkDialogProps()}
      />
    ));

    await waitFor(() => {
      expect(screen.getByLabelText("Description")).toBeInTheDocument();
    });
  });

  it("appends a '*' to the label when the field is required", async () => {
    renderWithForm<FormValues>(({ control }) => (
      <RichTextControl
        label="Description"
        useController={createBoundTestController<FormValues>({
          control,
          name: "content",
          rules: { required: "Required" },
        })}
        {...linkDialogProps()}
      />
    ));

    await waitFor(() => {
      expect(screen.getByLabelText("Description *")).toBeInTheDocument();
    });
  });

  it("renders the helperText passed as a prop", async () => {
    renderWithForm<FormValues>(({ control }) => (
      <RichTextControl
        label="Description"
        helperText="Some helper text"
        useController={createBoundTestController<FormValues>({
          control,
          name: "content",
        })}
        {...linkDialogProps()}
      />
    ));

    await waitFor(() => {
      expect(screen.getByText("Some helper text")).toBeInTheDocument();
    });
  });

  it("initializes editor content from the field's default value", async () => {
    renderWithForm<FormValues>(
      ({ control }) => (
        <RichTextControl
          label="Description"
          useController={createBoundTestController<FormValues>({
            control,
            name: "content",
          })}
          {...linkDialogProps()}
        />
      ),
      { defaultValues: { content: "<p>Initial value</p>" } },
    );

    await waitFor(() => {
      expect(screen.getByText("Initial value")).toBeInTheDocument();
    });
  });

  it("makes the editor non-editable and disables the form control when disabled", async () => {
    const { container } = renderWithForm<FormValues>(({ control }) => (
      <RichTextControl
        label="Description"
        disabled
        useController={createBoundTestController<FormValues>({
          control,
          name: "content",
        })}
        {...linkDialogProps()}
      />
    ));

    await waitFor(() => {
      const proseMirror = container.querySelector(".ProseMirror");
      expect(proseMirror).not.toBeNull();
      expect(proseMirror).toHaveAttribute("contenteditable", "false");
    });
  });

  it("updates the field value when formatting is toggled via a toolbar button", async () => {
    const user = userEvent.setup();
    const { methods, container } = renderWithForm<FormValues>(
      ({ control }) => (
        <RichTextControl
          label="Description"
          useController={createBoundTestController<FormValues>({
            control,
            name: "content",
          })}
          {...linkDialogProps()}
        />
      ),
      { defaultValues: { content: "<p>Hello</p>" } },
    );

    await waitFor(() => {
      expect(container.querySelector(".ProseMirror")).not.toBeNull();
    });

    // Select all text via the standard browser keyboard shortcut, then toggle bold.
    // Keymap-driven commands (unlike raw text insertion) work reliably in jsdom
    // because ProseMirror handles them via keydown listeners, not native typing.
    await user.click(container.querySelector(".ProseMirror")!);
    await user.keyboard("{Control>}a{/Control}");
    await user.click(screen.getByRole("button", { name: "Fett" }));

    await waitFor(() => {
      expect(methods.getValues("content")).toContain("<strong>");
    });
  });

  it("supports forceSetValue via the imperative handle, even when content already exists", async () => {
    const ref = createRef<RichTextControlHandle>();

    renderWithForm<FormValues>(
      ({ control }) => (
        <RichTextControl
          ref={ref}
          label="Description"
          useController={createBoundTestController<FormValues>({
            control,
            name: "content",
          })}
          {...linkDialogProps()}
        />
      ),
      { defaultValues: { content: "<p>Original</p>" } },
    );

    await waitFor(() => {
      expect(screen.getByText("Original")).toBeInTheDocument();
    });

    act(() => {
      ref.current?.forceSetValue("<p>Forced</p>");
    });

    await waitFor(() => {
      expect(screen.queryByText("Original")).not.toBeInTheDocument();
      expect(screen.getByText("Forced")).toBeInTheDocument();
    });
  });

  it("passes disableLink/disableImageUpload through to the toolbar", async () => {
    renderWithForm<FormValues>(({ control }) => (
      <RichTextControl
        label="Description"
        disableLink
        disableImageUpload
        useController={createBoundTestController<FormValues>({
          control,
          name: "content",
        })}
        {...linkDialogProps()}
      />
    ));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Fett" })).toBeInTheDocument();
    });
    expect(
      screen.queryByRole("button", { name: "Link hinzufügen" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("rich-text-image-upload"),
    ).not.toBeInTheDocument();
  });
});
