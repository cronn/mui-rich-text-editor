import { useRef } from "react";
import { Box, Button, Stack } from "@mui/material";
import {
  RichTextControl,
  type RichTextControlHandle,
} from "@cronn/mui-rich-text-editor";
import { useExampleForm } from "../useExampleForm";

const TEMPLATES = [
  "<p><strong>Meeting notes:</strong> Discussed project timeline and deliverables.</p>",
  "<p><em>Draft announcement:</em> We are pleased to share our latest update.</p>",
  "<p>Dear team,</p><p>Please review the attached document by end of week.</p>",
];

export function ProgrammaticUpdateExample() {
  const editorRef = useRef<RichTextControlHandle>(null);
  const { handleSubmit, useContentController } = useExampleForm();

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        {TEMPLATES.map((template, i) => (
          <Button
            key={i}
            size="small"
            variant="outlined"
            onClick={() => editorRef.current?.forceSetValue(template)}
          >
            Template {i + 1}
          </Button>
        ))}
      </Stack>
      <form onSubmit={handleSubmit(() => {})}>
        <RichTextControl
          ref={editorRef}
          label="Content"
          useController={useContentController}
        />
      </form>
    </Box>
  );
}
