import { Close } from "@mui/icons-material";
import { IconButton, styled } from "@mui/material";
import defaultTranslations from "../lib/defaultTranslations";
import type { ReactElement } from "react";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(2),
  top: theme.spacing(2),
  color: theme.palette.action.active,
}));

export interface DialogCloseButtonTranslations {
  cancel: string;
}

interface DialogCloseButtonProps {
  disabled?: boolean;
  translations?: DialogCloseButtonTranslations;
  onClick: () => void;
}

export function DialogCloseButton(props: DialogCloseButtonProps): ReactElement {
  const translations =
    props.translations ?? defaultTranslations.dialogCloseButton;
  return (
    <StyledIconButton
      aria-label={translations.cancel}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      <Close />
    </StyledIconButton>
  );
}
