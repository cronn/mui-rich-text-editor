import { act, cleanup, render, waitFor } from "@testing-library/react";
import { EditorContent } from "@tiptap/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { CustomEditor } from "../lib/useCustomEditor";
import { useFormEditor } from "../lib/useFormEditor";
import type { ControllerRenderProps } from "react-hook-form";

afterEach(() => {
    cleanup();
});

interface TestFormValues {
    content: string;
}

interface MountResult {
    editor: CustomEditor;
    onChange: ReturnType<typeof vi.fn>;
}

async function mountFormEditor(initialValue: string | undefined, disabled?: boolean): Promise<MountResult> {
    const onChange = vi.fn();
    let latestEditor: CustomEditor | undefined;

    const field: ControllerRenderProps<TestFormValues, "content"> = {
        name: "content",
        value: initialValue as never,
        onChange,
        onBlur: vi.fn(),
        ref: vi.fn(),
    };

    function Host() {
        const editor = useFormEditor(field, disabled);
        latestEditor = editor;
        return <EditorContent editor={editor} />;
    }

    const { container } = render(<Host />);

    await waitFor(() => {
        if (container.querySelector(".ProseMirror") === null) {
            throw new Error("not ready");
        }
    });

    if (!latestEditor) {
        throw new Error("editor not initialized");
    }

    return { editor: latestEditor, onChange };
}

describe("useFormEditor", () => {
    it("initializes editor content from field.value", async () => {
        const { editor } = await mountFormEditor("<p>Initial</p>");
        expect(editor.getText()).toBe("Initial");
    });

    it("treats undefined field.value as empty content", async () => {
        const { editor } = await mountFormEditor(undefined);
        expect(editor.getText()).toBe("");
    });

    it("calls field.onChange with updated HTML on edit", async () => {
        const { editor, onChange } = await mountFormEditor("<p>Hello</p>");

        act(() => {
            editor.commands.setTextSelection(editor.state.doc.content.size - 1);
            editor.commands.insertContent(" World");
        });

        await waitFor(() => {
            expect(onChange).toHaveBeenCalled();
        });
        const lastCallValue = onChange.mock.calls.at(-1)?.[0] as string;
        expect(lastCallValue).toContain("Hello World");
    });

    it("normalizes an empty paragraph HTML to an empty string on update", async () => {
        const { editor, onChange } = await mountFormEditor("<p>Hello</p>");

        act(() => {
            editor.commands.selectAll();
            editor.commands.deleteSelection();
        });

        await waitFor(() => {
            expect(onChange).toHaveBeenCalled();
        });
        expect(onChange).toHaveBeenLastCalledWith("");
    });

    it("respects the disabled flag by making the editor non-editable", async () => {
        const { editor } = await mountFormEditor("<p>Hello</p>", true);
        expect(editor.isEditable).toBe(false);
    });
});
