import { cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { runInAct, renderEditor } from "./render-editor";

afterEach(() => {
  cleanup();
});

describe("useCustomEditor", () => {
  it("creates an editable editor by default", async () => {
    const { editor } = await renderEditor();
    expect(editor.isEditable).toBe(true);
  });

  it("creates a non-editable editor when disabled", async () => {
    const { editor } = await renderEditor({ disabled: true });
    expect(editor.isEditable).toBe(false);
  });

  it("renders initial HTML content", async () => {
    const { editor } = await renderEditor({ content: "<p>Hello world</p>" });
    expect(editor.getText()).toBe("Hello world");
  });

  it("toggles bold formatting", async () => {
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });

    runInAct(() => {
      editor.commands.selectAll();
      editor.chain().focus().toggleBold().run();
    });

    expect(editor.isActive("bold")).toBe(true);
    expect(editor.getHTML()).toContain("<strong>");
  });

  it("toggles italic formatting", async () => {
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });

    runInAct(() => {
      editor.commands.selectAll();
      editor.chain().focus().toggleItalic().run();
    });

    expect(editor.isActive("italic")).toBe(true);
  });

  it("toggles underline formatting", async () => {
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });

    runInAct(() => {
      editor.commands.selectAll();
      editor.chain().focus().toggleUnderline().run();
    });

    expect(editor.isActive("underline")).toBe(true);
  });

  it("sets and unsets font color", async () => {
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });

    runInAct(() => {
      editor.commands.selectAll();
      editor.chain().focus().setColor("#ff0000").run();
    });
    expect(
      (editor.getAttributes("textStyle") as { color?: string }).color,
    ).toBe("#ff0000");

    runInAct(() => {
      editor.chain().focus().unsetColor().run();
    });
    expect(
      (editor.getAttributes("textStyle") as { color?: string }).color,
    ).toBeUndefined();
  });

  it("sets font size", async () => {
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });

    runInAct(() => {
      editor.commands.selectAll();
      editor.chain().focus().setFontSize("20px").run();
    });

    expect(
      (editor.getAttributes("textStyle") as { fontSize?: string }).fontSize,
    ).toBe("20px");
  });

  it("sets text alignment on paragraphs", async () => {
    const { editor } = await renderEditor({ content: "<p>Hello</p>" });

    runInAct(() => {
      editor.commands.setTextAlign("right");
    });

    expect(
      (editor.getAttributes("paragraph") as { textAlign?: string }).textAlign,
    ).toBe("right");
  });

  describe("customImage node", () => {
    it("insertCustomImage inserts an image node with given attributes", async () => {
      const { editor } = await renderEditor({ content: "<p></p>" });

      runInAct(() => {
        editor.commands.insertCustomImage({
          src: "https://example.com/a.png",
          width: "100",
          height: "50",
        });
      });

      expect(editor.getHTML()).toContain("https://example.com/a.png");
      expect(editor.getHTML()).toContain('width="100"');
      expect(editor.getHTML()).toContain('height="50"');
    });

    it("insertCustomImage defaults align to 'center' when omitted", async () => {
      const { editor } = await renderEditor({ content: "<p></p>" });

      runInAct(() => {
        editor.commands.insertCustomImage({ src: "https://example.com/a.png" });
      });

      const doc = editor.getJSON();
      const imageNode = doc.content?.find(
        (node) => node.type === "customImage",
      );
      expect(imageNode?.attrs?.align).toBe("center");
    });

    it("setImageAlign updates align attribute when selection is on the image", async () => {
      const { editor } = await renderEditor({ content: "<p></p>" });

      runInAct(() => {
        editor.commands.insertCustomImage({
          src: "https://example.com/a.png",
          align: "left",
        });
      });

      runInAct(() => {
        editor.commands.setTextSelection(0);
        const success = editor.commands.setImageAlign("right");
        expect(success).toBe(true);
      });

      const doc = editor.getJSON();
      const imageNode = doc.content?.find(
        (node) => node.type === "customImage",
      );
      expect(imageNode?.attrs?.align).toBe("right");
    });

    it("setImageAlign returns false when selection is not on an image", async () => {
      const { editor } = await renderEditor({ content: "<p>Hello</p>" });

      // The `setImageAlign` command's declared return type (`ReturnType<Editor["chain"]>`)
      // doesn't match its actual runtime return value (a boolean, per tiptap's command
      // convention); cast through `unknown` to assert on the real runtime behavior.
      let success = true;
      runInAct(() => {
        editor.commands.setTextSelection(1);
        success = editor.commands.setImageAlign("right") as unknown as boolean;
      });

      expect(success).toBe(false);
    });

    it("parses width/height from a raw <img> tag", async () => {
      const { editor } = await renderEditor({
        content:
          '<img src="https://example.com/raw.png" width="30" height="20" />',
      });

      const doc = editor.getJSON();
      const imageNode = doc.content?.find(
        (node) => node.type === "customImage",
      );
      expect(imageNode?.attrs?.width).toBe("30");
      expect(imageNode?.attrs?.height).toBe("20");
    });

    it("parses align='center' from inline margin:auto styles on a raw <img> tag", async () => {
      const { editor } = await renderEditor({
        content:
          '<img src="https://example.com/raw.png" style="margin-left:auto;margin-right:auto;" />',
      });

      const doc = editor.getJSON();
      const imageNode = doc.content?.find(
        (node) => node.type === "customImage",
      );
      expect(imageNode?.attrs?.align).toBe("center");
    });

    it("parses align='right' from inline margin-left:auto;margin-right:0px styles", async () => {
      const { editor } = await renderEditor({
        content:
          '<img src="https://example.com/raw.png" style="margin-left:auto;margin-right:0px;" />',
      });

      const doc = editor.getJSON();
      const imageNode = doc.content?.find(
        (node) => node.type === "customImage",
      );
      expect(imageNode?.attrs?.align).toBe("right");
    });

    it("defaults align to 'left' when no matching inline margin styles are present", async () => {
      const { editor } = await renderEditor({
        content: '<img src="https://example.com/raw.png" />',
      });

      const doc = editor.getJSON();
      const imageNode = doc.content?.find(
        (node) => node.type === "customImage",
      );
      expect(imageNode?.attrs?.align).toBe("left");
    });
  });
});
