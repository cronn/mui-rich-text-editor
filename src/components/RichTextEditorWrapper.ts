import { Box, styled } from "@mui/material";

export const RichTextEditorWrapper = styled(Box, {
    shouldForwardProp: (prop) => prop !== "error",
})<{ error?: boolean }>(({ theme, error }) => ({
    border: `1px solid ${error === true ? theme.palette.error.main : theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
    "&:focus-within": {
        boxShadow: `0 0 0 1px ${error === true ? theme.palette.error.main : theme.palette.primary.main}`,
        borderColor: error === true ? theme.palette.error.main : theme.palette.primary.main,
    },
    "& .ProseMirror": {
        outline: "none",
        "& img": {
            maxWidth: "100%",
            height: "auto",
            display: "block",
        },
        "& a": {
            color: theme.palette.primary.main,
            textDecoration: "none",
            cursor: "pointer",
            "&:hover": {
                textDecoration: "underline",
            },
        },
    },
}));