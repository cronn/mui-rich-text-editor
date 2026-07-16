import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import type { BoxProps } from "@mui/material";
import { Box, IconButton, Tooltip } from "@mui/material";
import { styled } from "@mui/system";

import type { AlignToggleButtonGroupTranslations } from "./AlignToggleButtonGroup";
import { AlignToggleButtonGroup } from "./AlignToggleButtonGroup";
import { FontColorDropdown } from "./FontColorDropdown";
import { FontSizeDropdown } from "./FontSizeDropdown";
import { ImageUploadButton } from "./ImageUploadButton";
import type { LinkButtonProps, LinkButtonTranslations } from "./LinkButton";
import { LinkButton } from "./LinkButton";
import type { CustomEditor } from "../lib/useCustomEditor";
import { useEditorActiveState } from "../lib/useEditorActiveState";
import { getToolbarButtonColor } from "../lib/utils";
import defaultTranslations from "../lib/defaultTranslations";
import type { ReactElement } from "react";

export const ToolbarContainer: React.ComponentType<BoxProps> = styled(Box)(
  ({ theme }) => ({
    display: "flex",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
    flexWrap: "wrap",
  }),
);

type LinkButtonInjectedProps = Omit<
  LinkButtonProps,
  "editor" | "active" | "translations"
>;

export interface EditorToolbarTranslations {
  bold: string;
  italic: string;
  underline: string;
  bulletList: string;
  orderedList: string;
  alignToggleButtonGroup?: AlignToggleButtonGroupTranslations;
  linkButtonTranslations?: LinkButtonTranslations;
}

export interface EditorToolbarProps extends LinkButtonInjectedProps {
  editor: CustomEditor;
  disableLink?: boolean;
  disableImageUpload?: boolean;
  translations?: EditorToolbarTranslations;
}

export function EditorToolbar(props: EditorToolbarProps): ReactElement {
  const active = useEditorActiveState(props.editor);
  const { editor, disableLink, disableImageUpload, ...linkButtonProps } = props;
  const translations = props.translations ?? defaultTranslations.editorToolbar;

  return (
    <ToolbarContainer>
      <Tooltip title={translations.bold}>
        <IconButton
          color={getToolbarButtonColor(active.bold)}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <FormatBoldIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={translations.italic}>
        <IconButton
          color={getToolbarButtonColor(active.italic)}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <FormatItalicIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={translations.underline}>
        <IconButton
          color={getToolbarButtonColor(active.underline)}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <FormatUnderlinedIcon />
        </IconButton>
      </Tooltip>
      <FontColorDropdown editor={editor} activeFontColor={active.fontColor} />
      <FontSizeDropdown editor={editor} activeFontSize={active.fontSize} />
      <AlignToggleButtonGroup
        editor={editor}
        active={active}
        translations={props.translations?.alignToggleButtonGroup}
      />
      <Tooltip title={translations.bulletList}>
        <IconButton
          color={getToolbarButtonColor(active.bulletList)}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FormatListBulletedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={translations.orderedList}>
        <IconButton
          color={getToolbarButtonColor(active.orderedList)}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <FormatListNumberedIcon />
        </IconButton>
      </Tooltip>
      {disableLink !== true && (
        <LinkButton
          {...linkButtonProps}
          translations={props.translations?.linkButtonTranslations}
          editor={editor}
          active={active.link}
        />
      )}
      {disableImageUpload !== true && <ImageUploadButton editor={editor} />}
    </ToolbarContainer>
  );
}
