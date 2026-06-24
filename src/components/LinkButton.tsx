import LinkIcon from "@mui/icons-material/Link";
import { IconButton, Tooltip } from "@mui/material";
import { useState } from "react";

import { LinkDialog, LinkDialogProps } from "./LinkDialog";
import type { CustomEditor } from "./useCustomEditor";
import { getToolbarButtonColor } from "./utils";

function normalizeUrl(url: string): string {
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
}

type LinkDialogInjectedProps = Omit<LinkDialogProps, "onSubmit" | "onClose" | "open">;

export interface LinkButtonProps extends LinkDialogInjectedProps {
    editor: CustomEditor;
    active: boolean;
    tooltipLabel: string;
}

export function LinkButton(props: LinkButtonProps) {
    const [linkDialogOpen, setLinkDialogOpen] = useState(false);

    function openLinkDialog() {
        setLinkDialogOpen(true);
    }

    function closeLinkDialog() {
        setLinkDialogOpen(false);
    }

    function handleLinkSubmit(url: string) {
        props.editor.chain().focus().setLink({ href: normalizeUrl(url) }).run();
    }

    const { editor, active, tooltipLabel, ...linkDialogProps } = props;

    return (
        <>
            <Tooltip title={tooltipLabel}>
                <IconButton color={getToolbarButtonColor(active)} onClick={openLinkDialog}>
                    <LinkIcon />
                </IconButton>
            </Tooltip>
            {linkDialogOpen && (
                <LinkDialog
                    {...linkDialogProps}
                    open={linkDialogOpen}
                    onClose={closeLinkDialog}
                    onSubmit={handleLinkSubmit}
                />
            )}
        </>
    );
}