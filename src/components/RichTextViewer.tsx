import { Box } from "@mui/material";
import { EditorContent } from "@tiptap/react";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { RichTextEditorWrapper } from "./RichTextEditorWrapper";
import { useCustomEditor } from "../lib/useCustomEditor";
import { isDefined, isUndefined } from "../lib/utils";

interface RichTextViewerProps {
  value: string;
}

export function RichTextViewer(props: RichTextViewerProps): ReactNode {
  const editor = useCustomEditor({
    content: props.value,
    disabled: true,
  });

  useEffect(() => {
    if (isDefined(props.value) && isDefined(editor) && !editor.isDestroyed) {
      editor.commands.setContent(props.value);
    }
  }, [props.value, editor]);

  if (isUndefined(editor)) {
    return null;
  }

  return (
    <Box data-testid="rich-text-control">
      <RichTextEditorWrapper>
        <Box px={1} data-testid="editor-content">
          <EditorContent editor={editor} />
        </Box>
      </RichTextEditorWrapper>
    </Box>
  );
}
