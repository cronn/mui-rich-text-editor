// lib/components/toolbar/EditorToolbar.tsx
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import { Box, IconButton, Tooltip } from "@mui/material";
import { styled } from "@mui/system";

import { AlignToggleButtonGroup } from "./AlignToggleButtonGroup";
import { FontColorDropdown } from "./FontColorDropdown";
import { FontSizeDropdown } from "./FontSizeDropdown";
import { ImageUploadButton } from "./ImageUploadButton";
import { LinkButton, LinkButtonProps } from "./LinkButton";
import type { CustomEditor } from "./useCustomEditor";
import { useEditorActiveState } from "./useEditorActiveState";
import { getToolbarButtonColor } from "./utils";

export const ToolbarContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
    flexWrap: "wrap",
}));

// everything LinkButton needs except what EditorToolbar already controls (editor/active)
type LinkButtonInjectedProps = Omit<LinkButtonProps, "editor" | "active">;

export interface EditorToolbarLabels {
    bold: string;
    italic: string;
    underline: string;
    bulletList: string;
    orderedList: string;
}

export interface EditorToolbarProps extends LinkButtonInjectedProps {
    editor: CustomEditor;
    disableLink?: boolean;
    disableImageUpload?: boolean;
    labels: EditorToolbarLabels;
}

export function EditorToolbar(props: EditorToolbarProps) {
    const active = useEditorActiveState(props.editor);
    const { editor, disableLink, disableImageUpload, labels, ...linkButtonProps } = props;

    return (
        <ToolbarContainer>
            <Tooltip title={labels.bold}>
                <IconButton
                    color={getToolbarButtonColor(active.bold)}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <FormatBoldIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={labels.italic}>
                <IconButton
                    color={getToolbarButtonColor(active.italic)}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <FormatItalicIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={labels.underline}>
                <IconButton
                    color={getToolbarButtonColor(active.underline)}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                    <FormatUnderlinedIcon />
                </IconButton>
            </Tooltip>
            <FontColorDropdown editor={editor} activeFontColor={active.fontColor} />
            <FontSizeDropdown editor={editor} activeFontSize={active.fontSize} />
            <AlignToggleButtonGroup editor={editor} active={active} />
            <Tooltip title={labels.bulletList}>
                <IconButton
                    color={getToolbarButtonColor(active.bulletList)}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <FormatListBulletedIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={labels.orderedList}>
                <IconButton
                    color={getToolbarButtonColor(active.orderedList)}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <FormatListNumberedIcon />
                </IconButton>
            </Tooltip>
            {!disableLink && <LinkButton {...linkButtonProps} editor={editor} active={active.link} />}
            {!disableImageUpload && <ImageUploadButton editor={editor} />}
        </ToolbarContainer>
    );
}