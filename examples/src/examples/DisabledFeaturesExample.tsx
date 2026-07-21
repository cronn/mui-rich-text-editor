import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { RichTextControl } from "@cronn/mui-rich-text-editor";
import { useExampleForm, type ExampleFormValues } from "../useExampleForm";

export function DisabledFeaturesExample() {
  const [submitted, setSubmitted] = useState<string | null>(null);
  const { handleSubmit, useContentController } = useExampleForm();

  const onSubmit = (values: ExampleFormValues) => {
    setSubmitted(values.content);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RichTextControl
          label="Comment"
          disableLink
          disableImageUpload
          useController={useContentController}
        />
        <Box sx={{ mt: 1 }}>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </Box>
      </form>
      {submitted !== null && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Submitted HTML:
          </Typography>
          <Box
            component="pre"
            sx={{
              m: 0,
              p: 1.5,
              bgcolor: "grey.100",
              borderRadius: 1,
              fontSize: "0.8rem",
              overflow: "auto",
            }}
          >
            {submitted}
          </Box>
        </Box>
      )}
    </Box>
  );
}
