import FormatSizeIcon from "@mui/icons-material/FormatSize";
import { Box, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { useRef, useState } from "react";

import type { CustomEditor } from "./useCustomEditor";

const sizes = ["12px", "14px", "16px", "18px", "20px", "24px", "28px"];

interface FontSizeDropdownProps {
    editor: CustomEditor;
    activeFontSize?: string;
}

export function FontSizeDropdown(props: FontSizeDropdownProps) {
    const [open, setOpen] = useState(false);
    const menuButtonRef = useRef<HTMLButtonElement | null>(null);

    const currentFontSize = props.editor.getAttributes("textStyle").fontSize || "16px";
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

    return (
        <>
            <Tooltip title={"TODO Schriftgröße"}>
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
