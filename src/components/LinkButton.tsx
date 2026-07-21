import LinkIcon from "@mui/icons-material/Link";
import { IconButton, Tooltip } from "@mui/material";
import type { ReactElement } from "react";
import { useState } from "react";

import type { LinkDialogTranslations } from "./LinkDialog";
import { LinkDialog } from "./LinkDialog";
import type { CustomEditor } from "../lib/useCustomEditor";
import { getToolbarButtonColor } from "../lib/utils";
import defaultTranslations from "../lib/defaultTranslations";

function normalizeUrl(url: string): string {
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
}

export interface LinkButtonTranslations {
  tooltip: string;
  linkDialog: LinkDialogTranslations;
}

export interface LinkButtonProps {
  editor: CustomEditor;
  active: boolean;
  translations?: LinkButtonTranslations;
}

export function LinkButton(props: LinkButtonProps): ReactElement {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);

  function openLinkDialog() {
    setLinkDialogOpen(true);
  }

  function closeLinkDialog() {
    setLinkDialogOpen(false);
  }

  function handleLinkSubmit(url: string) {
    props.editor
      .chain()
      .focus()
      .setLink({ href: normalizeUrl(url) })
      .run();
  }

  const translations = props.translations ?? defaultTranslations.linkButton;

  return (
    <>
      <Tooltip title={translations.tooltip}>
        <IconButton
          color={getToolbarButtonColor(props.active)}
          onClick={openLinkDialog}
        >
          <LinkIcon />
        </IconButton>
      </Tooltip>
      {linkDialogOpen && (
        <LinkDialog
          open={linkDialogOpen}
          onClose={closeLinkDialog}
          onSubmit={handleLinkSubmit}
          translations={
            props.translations
              ? props.translations.linkDialog
              : defaultTranslations.linkDialog
          }
        />
      )}
    </>
  );
}
