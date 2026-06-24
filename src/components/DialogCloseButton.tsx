import { Close } from "@mui/icons-material";
import { IconButton, styled } from "@mui/material";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    position: "absolute",
    right: theme.spacing(2),
    top: theme.spacing(2),
    color: theme.palette.action.active,
}));

interface DialogCloseButtonProps {
    disabled?: boolean;
    onClick: () => void;
}

export function DialogCloseButton(props: DialogCloseButtonProps) {
    return (
        <StyledIconButton
            aria-label={"TODO Abbrechen"}
            disabled={props.disabled}
            onClick={props.onClick}
        >
            <Close />
        </StyledIconButton>
    );
}
