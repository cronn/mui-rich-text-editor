import { act, cleanup, render, waitFor } from "@testing-library/react";
import { EditorContent } from "@tiptap/react";
import { afterEach, describe, expect, it } from "vitest";

import type { ActiveMarks } from "../lib/useEditorActiveState";
import { useEditorActiveState } from "../lib/useEditorActiveState";
import type { CustomEditor } from "../lib/useCustomEditor";
import { useCustomEditor } from "../lib/useCustomEditor";
import { isDefined } from "../lib/utils";

afterEach(() => {
  cleanup();
});

interface MountResult {
  editor: CustomEditor;
  getActive: () => ActiveMarks;
}

async function mountActiveState(content: string): Promise<MountResult> {
  let latestEditor: CustomEditor | undefined;
  let latestActive: ActiveMarks | undefined;

  function Inner({ editor }: { editor: CustomEditor }) {
    const active = useEditorActiveState(editor);
    latestActive = active;
    return <EditorContent editor={editor} />;
  }

  function Host() {
    const editor = useCustomEditor({ content });
    latestEditor = editor;
    // `useCustomEditor`'s declared return type is non-nullable, but tiptap's
    // underlying `useEditor` (with `immediatelyRender: false`) actually
    // returns `null` on the very first render before the editor view has
    // mounted; the library's own components guard against this using
    // `isUndefined`/`isDefined` (see e.g. RichTextControl.tsx), so we mirror
    // that pattern here rather than trusting the (slightly inaccurate) type.
    return isDefined(editor) ? <Inner editor={editor} /> : null;
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

  return {
    editor: latestEditor,
    getActive: () => {
      if (!latestActive) {
        throw new Error("active state not captured");
      }
      return latestActive;
    },
  };
}

describe("useEditorActiveState", () => {
  it("starts with all marks deactivated when unfocused", async () => {
    const { getActive } = await mountActiveState("<p>Hello</p>");

    expect(getActive()).toEqual({
      bold: false,
      italic: false,
      underline: false,
      fontColor: undefined,
      fontSize: undefined,
      textAlign: undefined,
      imageAlign: undefined,
      bulletList: false,
      orderedList: false,
      link: false,
    });
  });

  it("reflects bold state after toggling bold while focused", async () => {
    const { editor, getActive } = await mountActiveState("<p>Hello</p>");

    act(() => {
      editor.commands.selectAll();
      editor.chain().focus().toggleBold().run();
    });

    await waitFor(() => {
      expect(getActive().bold).toBe(true);
    });
  });

  it("reflects fontColor/fontSize/textAlign attrs", async () => {
    const { editor, getActive } = await mountActiveState("<p>Hello</p>");

    act(() => {
      editor.commands.selectAll();
      editor.chain().focus().setColor("#00ff00").setFontSize("18px").run();
      editor.commands.setTextAlign("center");
    });

    await waitFor(() => {
      const active = getActive();
      expect(active.fontColor).toBe("#00ff00");
      expect(active.fontSize).toBe("18px");
      expect(active.textAlign).toBe("center");
    });
  });

  it("reflects imageAlign attr when an image node is selected", async () => {
    const { editor, getActive } = await mountActiveState("<p></p>");

    act(() => {
      editor.commands.insertCustomImage({
        src: "https://example.com/a.png",
        align: "right",
      });
      editor.commands.focus();
      editor.commands.setNodeSelection(0);
    });

    await waitFor(() => {
      expect(getActive().imageAlign).toBe("right");
    });
  });

  it("resets all marks to defaults on blur", async () => {
    const { editor, getActive } = await mountActiveState("<p>Hello</p>");

    act(() => {
      editor.commands.selectAll();
      editor.chain().focus().toggleBold().run();
    });

    await waitFor(() => {
      expect(getActive().bold).toBe(true);
    });

    act(() => {
      editor.commands.blur();
    });

    await waitFor(() => {
      expect(getActive()).toEqual({
        bold: false,
        italic: false,
        underline: false,
        fontColor: undefined,
        fontSize: undefined,
        textAlign: undefined,
        imageAlign: undefined,
        bulletList: false,
        orderedList: false,
        link: false,
      });
    });
  });

  it("detects bulletList active state", async () => {
    const { editor, getActive } = await mountActiveState("<p>Hello world</p>");

    // Toggling block-level list types operates on the current text selection's
    // block range; an `AllSelection` (from selectAll) spans multiple blocks
    // (including the trailing empty paragraph) so `isActive` would report false.
    act(() => {
      editor.chain().focus().toggleBulletList().run();
    });

    await waitFor(() => {
      expect(getActive().bulletList).toBe(true);
    });
  });

  it("detects orderedList active state", async () => {
    const { editor, getActive } = await mountActiveState("<p>Hello world</p>");

    act(() => {
      editor.chain().focus().toggleOrderedList().run();
    });

    await waitFor(() => {
      expect(getActive().orderedList).toBe(true);
    });
  });

  it("detects link active state", async () => {
    const { editor, getActive } = await mountActiveState("<p>Hello world</p>");

    act(() => {
      editor.commands.selectAll();
      editor.chain().focus().setLink({ href: "https://example.com" }).run();
    });

    await waitFor(() => {
      expect(getActive().link).toBe(true);
    });
  });
});
