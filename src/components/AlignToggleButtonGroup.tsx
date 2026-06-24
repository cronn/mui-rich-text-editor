import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

import type { CustomEditor } from "./useCustomEditor";
import type { ActiveMarks } from "./useEditorActiveState";
import type { Align } from "./utils";

function isSelected(props: AlignToggleButtonGroupProps, align: Align) {
    return props.active.textAlign === align || props.active.imageAlign === align;
}

interface AlignToggleButtonGroupProps {
    editor: CustomEditor;
    active: ActiveMarks;
}

export function AlignToggleButtonGroup(props: AlignToggleButtonGroupProps) {

    function handleAlign(align: Align) {
        props.editor.chain().focus().run();
        props.editor.commands.setTextAlign(align);
        props.editor.commands.setImageAlign(align);
    }

    return (
        <ToggleButtonGroup size="small" exclusive>
            <ToggleButton
                aria-label={"TODO Links"}
                value="left"
                selected={isSelected(props, "left")}
                onClick={() => handleAlign("left")}
            >
                <FormatAlignLeftIcon />
            </ToggleButton>

            <ToggleButton
                aria-label={"TODO Zentriert"}
                value="center"
                selected={isSelected(props, "center")}
                onClick={() => handleAlign("center")}
            >
                <FormatAlignCenterIcon />
            </ToggleButton>

            <ToggleButton
                aria-label={"TODO Rechts"}
                value="right"
                selected={isSelected(props, "right")}
                onClick={() => handleAlign("right")}
            >
                <FormatAlignRightIcon />
            </ToggleButton>
        </ToggleButtonGroup>
    );
}
