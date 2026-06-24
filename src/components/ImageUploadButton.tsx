import ImageIcon from "@mui/icons-material/Image";
import { IconButton, Tooltip } from "@mui/material";
import type { ChangeEvent } from "react";

import type { CustomEditor } from "./useCustomEditor";
import { CUSTOM_EDITOR_IMAGE_MAX_WIDTH } from "./useCustomEditor";
import { isUndefined } from "./utils";

interface ImageUploadButtonProps {
    editor: CustomEditor;
}

export function ImageUploadButton(props: ImageUploadButtonProps) {

    function handleUpload(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (isUndefined(file)) {
            return;
        }

        insertResizedImage(file, props.editor);
    }

    return (
        <Tooltip title={"TODO Grafik hochladen"}>
            <IconButton component="label">
                <ImageIcon />
                <input
                    data-testid="rich-text-image-upload"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleUpload}
                />
            </IconButton>
        </Tooltip>
    );
}

function insertResizedImage(file: File, editor: CustomEditor) {
    const reader = new FileReader();

    reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;

        img.onload = () => {
            const maxWidth = CUSTOM_EDITOR_IMAGE_MAX_WIDTH;
            const originalWidth = img.width;
            const originalHeight = img.height;

            let src: string;
            let width = originalWidth;
            let height = originalHeight;

            if (originalWidth > maxWidth) {
                const scale = maxWidth / originalWidth;
                width = maxWidth;
                height = originalHeight * scale;

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                src = canvas.toDataURL("image/jpeg", 0.8);
            } else {
                src = img.src;
            }

            editor.chain().focus().run();
            editor.commands.insertCustomImage({
                src,
                width: width.toString(),
                height: height.toString(),
                align: "left",
            });
        };
    };

    reader.readAsDataURL(file);
}
