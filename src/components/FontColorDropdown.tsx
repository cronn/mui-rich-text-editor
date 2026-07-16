import { CircleRounded, MotionPhotosOffOutlined } from "@mui/icons-material";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { Box } from "@mui/system";
import type { ReactElement } from "react";
import { useRef, useState } from "react";
import type { CustomEditor } from "../lib/useCustomEditor";
import { Colors } from "../lib/colors";
import { isDefined, isUndefined } from "../lib/utils";
import defaultTranslations from "../lib/defaultTranslations";

export interface FontColorDropdownTranslations {
  tooltip: string;
  automatic: string;
  colors: {
    black: string;
    gray: string;
    red: string;
    blue: string;
    turquoise: string;
    green: string;
    orange: string;
    purple: string;
    pink: string;
  };
}

interface FontColorDropdownProps {
  editor: CustomEditor;
  activeFontColor?: string;
  translations?: FontColorDropdownTranslations;
}

function getColorName(
  color: Colors,
  translations?: FontColorDropdownTranslations,
): string {
  const colorTranslations =
    translations?.colors ?? defaultTranslations.fontColorDropdown.colors;

  switch (color) {
    case Colors.Black:
      return colorTranslations.black;
    case Colors.Gray:
      return colorTranslations.gray;
    case Colors.Red:
      return colorTranslations.red;
    case Colors.Blue:
      return colorTranslations.blue;
    case Colors.Turquoise:
      return colorTranslations.turquoise;
    case Colors.Green:
      return colorTranslations.green;
    case Colors.Orange:
      return colorTranslations.orange;
    case Colors.Purple:
      return colorTranslations.purple;
    case Colors.Pink:
      return colorTranslations.pink;
    default:
      return "";
  }
}

export function FontColorDropdown(props: FontColorDropdownProps): ReactElement {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  const currentFontColor = (
    props.editor.getAttributes("textStyle") as { color?: string }
  ).color;
  const isActive =
    isDefined(props.activeFontColor) &&
    props.activeFontColor === currentFontColor;

  const translations =
    props.translations ?? defaultTranslations.fontColorDropdown;

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
      <Tooltip title={translations.tooltip}>
        <IconButton
          color={isActive ? "primary" : "default"}
          onClick={handleOpenMenu}
          ref={menuButtonRef}
        >
          <FormatColorTextIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={menuButtonRef.current}
        open={open}
        onClose={handleCloseMenu}
      >
        <MenuItem key="auto-color" onClick={() => handleColorSelect(undefined)}>
          <ListItemIcon>
            <MotionPhotosOffOutlined />
          </ListItemIcon>
          <ListItemText>{translations.automatic}</ListItemText>
        </MenuItem>
        {Object.values(Colors).map((color) => (
          <MenuItem
            key={color}
            selected={currentFontColor === color}
            onClick={() => handleColorSelect(color)}
          >
            <ListItemIcon>
              <CircleRounded sx={{ color }} />
            </ListItemIcon>
            <ListItemText>
              {getColorName(color, props.translations)}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
