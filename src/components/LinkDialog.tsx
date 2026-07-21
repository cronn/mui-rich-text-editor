import type {
  DialogActionsProps,
  DialogContentProps,
  DialogTitleProps,
} from "@mui/material";
import {
  Button,
  DialogTitle,
  styled,
  Dialog,
  DialogActions,
  DialogContent as MuiDialogContent,
  TextField,
} from "@mui/material";
import { useController } from "react-hook-form";
import type { DialogCloseButtonTranslations } from "./DialogCloseButton";
import { DialogCloseButton } from "./DialogCloseButton";
import { useCustomForm } from "../lib/utils";
import defaultTranslations from "../lib/defaultTranslations";
import type { ReactElement } from "react";

export const StyledDialogTitle: React.ComponentType<DialogTitleProps> = styled(
  DialogTitle,
)(({ theme }) => ({
  fontSize: theme.typography.h5.fontSize,
  fontWeight: theme.typography.fontWeightBold,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
}));

const StyledDialogActions: React.ComponentType<DialogActionsProps> = styled(
  DialogActions,
)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  padding: theme.spacing(2),
}));

const DialogContent: React.ComponentType<DialogContentProps> = styled(
  MuiDialogContent,
)(({ theme }) => ({
  padding: theme.spacing(4),
  overflow: "visible",
}));

interface LinkFormValues {
  url: string;
}

export interface LinkDialogTranslations {
  title: string;
  urlLabel: string;
  urlRequiredMessage: string;
  ctaLabel: string;
  dialogCloseButton?: DialogCloseButtonTranslations;
}

export interface LinkDialogProps {
  onSubmit: (url: string) => void;
  onClose: () => void;
  open: boolean;
  translations?: LinkDialogTranslations;
}

export function LinkDialog(props: LinkDialogProps): ReactElement {
  const { control, getValues, trigger } = useCustomForm<LinkFormValues>({
    defaultValues: { url: "" },
  });

  const translations = props.translations ?? defaultTranslations.linkDialog;

  const { field, fieldState } = useController<LinkFormValues>({
    control,
    name: "url",
    rules: { required: translations.urlRequiredMessage },
  });

  async function handleSubmitClick() {
    const valid = await trigger();
    if (!valid) {
      return;
    }
    const values = getValues();
    props.onSubmit(values.url);
    props.onClose();
  }

  return (
    <Dialog open={props.open} fullWidth maxWidth="sm" onClose={props.onClose}>
      <StyledDialogTitle>
        {translations.title}
        <DialogCloseButton
          onClick={props.onClose}
          translations={props.translations?.dialogCloseButton}
        />
      </StyledDialogTitle>
      <DialogContent>
        <TextField
          inputRef={field.ref}
          value={field.value}
          label={translations.urlLabel}
          required
          fullWidth
          error={fieldState.invalid}
          helperText={fieldState.error?.message}
          onChange={(e) => field.onChange(e.target.value)}
          onBlur={(e) => {
            field.onChange(e.target.value.trim());
            field.onBlur();
          }}
        />
      </DialogContent>
      <StyledDialogActions>
        <Button
          color="primary"
          variant="contained"
          size="large"
          data-testid="cta-button"
          onClick={() => void handleSubmitClick()}
        >
          {translations.ctaLabel}
        </Button>
      </StyledDialogActions>
    </Dialog>
  );
}
