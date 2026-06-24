import { CircleRounded, MotionPhotosOffOutlined } from "@mui/icons-material";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import { useRef, useState } from "react";

import type { CustomEditor } from "./useCustomEditor";
import { Colors } from "./colors";
import { isDefined, isUndefined } from "./utils";

interface ColorItem {
    name: string;
    hex: string;
}

const colors: Array<ColorItem> = [
    { name: "TODO Schwarz", hex: Colors.Black },
    { name: "TODO Grau", hex: Colors.Gray },
    { name: "TODO Rot", hex: Colors.Red },
    { name: "TODO Blau", hex: Colors.Blue },
    { name: "TODO Türkis", hex: Colors.Turquoise },
    { name: "TODO Grün", hex: Colors.Green },
    { name: "TODO Orange", hex: Colors.Orange },
    { name: "TODO Lila", hex: Colors.Purple },
    { name: "TODO Pink", hex: Colors.Pink },
];

interface FontColorDropdownProps {
    editor: CustomEditor;
    activeFontColor?: string;
}

export function FontColorDropdown(props: FontColorDropdownProps) {
    const [open, setOpen] = useState(false);
    const menuButtonRef = useRef<HTMLButtonElement | null>(null);

    const currentFontColor = props.editor.getAttributes("textStyle").color;
    const isActive = isDefined(props.activeFontColor) && props.activeFontColor === currentFontColor;

    function handleOpenMenu() {
        setOpen(true);
    }

    function handleCloseMenu() {
        setOpen(false);
    }

    function handleColorSelect(color: string | undefined) {
        if (isUndefined(color)) {
            props.editor.chain().focus().unsetColor().run();
        } else {
            props.editor.chain().focus().setColor(color).run();
        }
        handleCloseMenu();
    }

    return (
        <Box>
            <Tooltip title={"TODO Textfarbe"}>
                <IconButton color={isActive ? "primary" : undefined} onClick={handleOpenMenu} ref={menuButtonRef}>
                    <FormatColorTextIcon />
                </IconButton>
            </Tooltip>

            <Menu anchorEl={menuButtonRef.current} open={open} onClose={handleCloseMenu}>
                <MenuItem key="auto-color" onClick={() => handleColorSelect(undefined)}>
                    <ListItemIcon>
                        <MotionPhotosOffOutlined />
                    </ListItemIcon>
                    <ListItemText>{"TODO Automatisch"}</ListItemText>
                </MenuItem>
                {colors.map((color) => (
                    <MenuItem
                        key={color.hex}
                        selected={currentFontColor === color.hex}
                        onClick={() => handleColorSelect(color.hex)}
                    >
                        <ListItemIcon>
                            <CircleRounded sx={{ color: color.hex }} />
                        </ListItemIcon>
                        <ListItemText>{color.name}</ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}
