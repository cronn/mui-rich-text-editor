import { CircularProgress, InputAdornment, styled } from "@mui/material";
import { PropsWithChildren } from "react";

const StyledInputAdornment = styled(InputAdornment)<{ color?: string }>(({ color }) => ({
    color: color ?? "inherit",
}));

interface LoadingAdornmentProps extends PropsWithChildren {
    loading: boolean;
    color?: string;
}

export function LoadingAdornment(props: LoadingAdornmentProps) {
    return (
        <StyledInputAdornment color={props.color} position="end">
            {props.loading && <CircularProgress color="inherit" size={20} />}
            {props.children}
        </StyledInputAdornment>
    );
}
