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
} from "@mui/material";
import { TextControl } from "./TextControl";
import type { DialogCloseButtonTranslations } from "./DialogCloseButton";
import { DialogCloseButton } from "./DialogCloseButton";
import type {
  FormInputValues,
  UseControllerHook,
  CustomFormRegister,
} from "../lib/utils";
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

export type LinkDialogFormValues = FormInputValues<{
  url: string;
}>;

export interface UseLinkDialogFormReturn {
  registerField: CustomFormRegister<LinkDialogFormValues>;
  getValues: () => LinkDialogFormValues;
  trigger: () => Promise<boolean>;
}

export type UseLinkDialogForm = () => UseLinkDialogFormReturn;

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
  useForm: UseLinkDialogForm;
  useUrlFieldController: UseControllerHook<LinkDialogFormValues>;
  translations?: LinkDialogTranslations;
}

export function LinkDialog(props: LinkDialogProps): ReactElement {
  const { registerField, getValues, trigger } = props.useForm();

  async function handleSubmitClick() {
    const valid = await trigger();
    if (!valid) {
      return;
    }
    const values = getValues();
    props.onSubmit(values.url);
    props.onClose();
  }

  const translations = props.translations ?? defaultTranslations.linkDialog;

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
        <TextControl
          {...registerField("url", {
            required: translations.urlRequiredMessage,
          })}
          label={translations.urlLabel}
          useController={props.useUrlFieldController}
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
