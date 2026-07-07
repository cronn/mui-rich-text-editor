import { act, render, waitFor } from "@testing-library/react";
import { EditorContent } from "@tiptap/react";
import type { EditorEvents, HTMLContent, JSONContent } from "@tiptap/core";
import type { ReactElement } from "react";

import type { CustomEditor } from "../lib/useCustomEditor";
import { useCustomEditor } from "../lib/useCustomEditor";

interface RenderEditorOptions {
  content?: HTMLContent | JSONContent | Array<JSONContent> | null;
  disabled?: boolean;
  onUpdate?: (props: EditorEvents["update"]) => void;
}

interface RenderEditorResult {
  editor: CustomEditor;
  container: HTMLElement;
  rerender: () => void;
}

/**
 * Mounts a minimal host component around `useCustomEditor` + `EditorContent`,
 * waits for the ProseMirror view to attach (tiptap uses `immediatelyRender: false`),
 * and returns the live editor instance for driving commands in tests.
 */
export async function renderEditor(
  options: RenderEditorOptions = {},
): Promise<RenderEditorResult> {
  let latestEditor: CustomEditor | undefined;

  function Host(): ReactElement {
    const editor = useCustomEditor({
      content: options.content ?? "",
      disabled: options.disabled,
      onUpdate: options.onUpdate,
    });
    latestEditor = editor;
    return <EditorContent editor={editor} />;
  }

  const { container, rerender: rtlRerender } = render(<Host />);

  await waitFor(() => {
    if (container.querySelector(".ProseMirror") === null) {
      throw new Error("ProseMirror view not attached yet");
    }
  });

  if (!latestEditor) {
    throw new Error("Editor failed to initialize");
  }

  return {
    editor: latestEditor,
    container,
    rerender: () => rtlRerender(<Host />),
  };
}

/**
 * Wraps an editor command invocation in `act` so resulting React state
 * updates (e.g. from `onUpdate`/active-state listeners) are flushed.
 */
export function runInAct(fn: () => void): void {
  act(() => {
    fn();
  });
}
