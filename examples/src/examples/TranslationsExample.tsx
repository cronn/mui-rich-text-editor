import { Box } from "@mui/material";
import {
  RichTextControl,
  type EditorToolbarTranslations,
} from "@cronn/mui-rich-text-editor";
import { useExampleForm } from "../useExampleForm";

const translations: EditorToolbarTranslations = {
  bold: "Bold",
  italic: "Italic",
  underline: "Underline",
  bulletList: "Bullet list",
  orderedList: "Numbered list",
  alignToggleButtonGroup: {
    left: "Align left",
    center: "Center",
    right: "Align right",
  },
  linkButtonTranslations: {
    tooltip: "Insert link",
    linkDialog: {
      title: "Insert link",
      urlLabel: "URL",
      urlRequiredMessage: "Please enter a URL.",
      ctaLabel: "Insert",
    },
  },
  fontSizeDropdown: {
    tooltip: "Font size",
  },
  fontColorDropdown: {
    tooltip: "Font color",
    automatic: "Automatic",
    colors: {
      black: "Black",
      gray: "Gray",
      red: "Red",
      blue: "Blue",
      turquoise: "Turquoise",
      green: "Green",
      orange: "Orange",
      purple: "Purple",
      pink: "Pink",
    },
  },
  imageUploadButton: {
    tooltip: "Upload image",
  },
};

export function TranslationsExample() {
  const { useContentController } = useExampleForm();

  return (
    <Box>
      <form>
        <RichTextControl
          label="Description"
          translations={translations}
          useController={useContentController}
        />
      </form>
    </Box>
  );
}
