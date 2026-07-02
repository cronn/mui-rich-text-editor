import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

import type { CustomEditor } from "../lib/useCustomEditor";
import type { ActiveMarks } from "../lib/useEditorActiveState";
import type { Align } from "../lib/utils";
import defaultTranslations from "../lib/defaultTranslations";
import type { ReactElement } from "react";

function isSelected(props: AlignToggleButtonGroupProps, align: Align) {
    return props.active.textAlign === align || props.active.imageAlign === align;
}

export interface AlignToggleButtonGroupTranslations {
    left: string,
    center: string,
    right: string
}

interface AlignToggleButtonGroupProps {
    editor: CustomEditor;
    active: ActiveMarks;
    translations?: AlignToggleButtonGroupTranslations
}

export function AlignToggleButtonGroup(props: AlignToggleButtonGroupProps): ReactElement {

    function handleAlign(align: Align) {
        props.editor.chain().focus().run();
        props.editor.commands.setTextAlign(align);
        props.editor.commands.setImageAlign(align);
    }

    const translations = props.translations ?? defaultTranslations.alignToggleButton;

    return (
        <ToggleButtonGroup size="small" exclusive>
            <ToggleButton
                aria-label={translations.left}
                value="left"
                selected={isSelected(props, "left")}
                onClick={() => handleAlign("left")}
            >
                <FormatAlignLeftIcon />
            </ToggleButton>

            <ToggleButton
                aria-label={translations.center}
                value="center"
                selected={isSelected(props, "center")}
                onClick={() => handleAlign("center")}
            >
                <FormatAlignCenterIcon />
            </ToggleButton>

            <ToggleButton
                aria-label={translations.right}
                value="right"
                selected={isSelected(props, "right")}
                onClick={() => handleAlign("right")}
            >
                <FormatAlignRightIcon />
            </ToggleButton>
        </ToggleButtonGroup>
    );
}
