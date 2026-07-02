import FormatSizeIcon from "@mui/icons-material/FormatSize";
import { Box, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import type { ReactElement} from "react";
import { useRef, useState } from "react";

import type { CustomEditor } from "../lib/useCustomEditor";
import defaultTranslations from "../lib/defaultTranslations";

const sizes = ["12px", "14px", "16px", "18px", "20px", "24px", "28px"];

interface FontSizeDropdownPropsTranslations {
    tooltip: string;
}

interface FontSizeDropdownProps {
    editor: CustomEditor;
    activeFontSize?: string;
    translations?: FontSizeDropdownPropsTranslations
}

export function FontSizeDropdown(props: FontSizeDropdownProps): ReactElement {
    const [open, setOpen] = useState(false);
    const menuButtonRef = useRef<HTMLButtonElement | null>(null);

    const fontSize = props.editor.getAttributes("textStyle").fontSize as string | undefined;
    const currentFontSize = fontSize ?? "16px";
    const isActive = props.activeFontSize === currentFontSize;

    function handleOpenMenu() {
        setOpen(true);
    }

    function handleCloseMenu() {
        setOpen(false);
    }

    function handleSelect(size: string) {
        props.editor.chain().focus().setFontSize(size).run();
        handleCloseMenu();
    }

    const translations = props.translations ?? defaultTranslations.fontSizeDropdown;

    return (
        <>
            <Tooltip title={translations.tooltip}>
                <IconButton color={isActive ? "primary" : "default"} onClick={handleOpenMenu} ref={menuButtonRef}>
                    <FormatSizeIcon />
                </IconButton>
            </Tooltip>

            <Menu anchorEl={menuButtonRef.current} open={open} onClose={handleCloseMenu}>
                {sizes.map((size) => (
                    <MenuItem key={size} selected={currentFontSize === size} onClick={() => handleSelect(size)}>
                        <Box
                            sx={{
                                fontSize: size,
                            }}
                        >
                            {parseInt(size)}
                        </Box>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}
