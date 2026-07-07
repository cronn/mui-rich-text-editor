import type { CommandProps, EditorEvents, HTMLContent, JSONContent } from "@tiptap/core";
import Color from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import { FontSize, TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { Dropcursor } from "@tiptap/extensions";
import type { Editor } from "@tiptap/react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { EditorState } from "prosemirror-state";

import type { Align } from "./utils";

export const CUSTOM_EDITOR_IMAGE_MAX_WIDTH = 700;

export type CustomEditor = Editor & {
    commands: Editor["commands"] & CustomImageCommands;
};

interface CustomImageCommands {
    insertCustomImage: (options: {
        src: string;
        width?: string;
        height?: string;
        align?: Align;
    }) => ReturnType<Editor["chain"]>;
    setImageAlign: (align: Align) => ReturnType<Editor["chain"]>;
}

interface InsertCustomImageOptions {
    src: string;
    width?: string | null;
    height?: string | null;
    align?: Align;
}

const CustomImage = Image.extend({
    name: "customImage",

    addAttributes() {
        return {
            ...this.parent?.(),
            align: {
                default: "center",
                parseHTML: (el) => {
                    const left = el.style.marginLeft;
                    const right = el.style.marginRight;

                    if (left === "auto" && right === "auto") {
                        return "center";
                    }
                    if (left === "auto" && right === "0px") {
                        return "right";
                    }
                    return "left";
                },
                renderHTML: (attrs) => ({
                    style:
                        attrs.align === "center"
                            ? "display:block;margin-left:auto;margin-right:auto;"
                            : attrs.align === "right"
                              ? "display:block;margin-left:auto;margin-right:0;"
                              : "display:block;margin-left:0;margin-right:auto;",
                }),
            },
            width: {
                default: null,
                parseHTML: (el) => el.getAttribute("width") ?? null,
                renderHTML: (attrs: { width: string | null }) =>
                    attrs.width !== null ? { width: attrs.width } : {},
            },
            height: {
                default: null,
                parseHTML: (el) => el.getAttribute("height") ?? null,
                renderHTML: (attrs: { height: string | null }) =>
                    attrs.height !== null ? { height: attrs.height } : {},
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "img",
                getAttrs: (el: HTMLElement) => ({
                    src: el.getAttribute("src"),
                    width: el.getAttribute("width"),
                    height: el.getAttribute("height"),
                    align: "center",
                }),
            },
        ];
    },

    addCommands() {
        return {
            ...this.parent?.(),
            insertCustomImage:
                (opts: InsertCustomImageOptions) =>
                ({ commands }: CommandProps) =>
                    commands.insertContent({
                        type: this.name,
                        attrs: {
                            src: opts.src,
                            width: opts.width,
                            height: opts.height,
                            align: opts.align ?? "center",
                        },
                    }),
            setImageAlign:
                (align: Align) =>
                ({ commands, state }: CommandProps & { state: EditorState }) => {
                    const node = state.doc.nodeAt(state.selection.from);
                    if (node?.type.name !== "customImage") {
                        return false;
                    }

                    return commands.command(({ tr }) => {
                        tr.setNodeMarkup(state.selection.from, undefined, { ...node.attrs, align });
                        return true;
                    });
                },
        };
    },
});

interface UseCustomEditorProps {
    content: HTMLContent | JSONContent | Array<JSONContent> | null;
    onUpdate?: (props: EditorEvents["update"]) => void;
    disabled?: boolean;
}

export function useCustomEditor(props: UseCustomEditorProps): CustomEditor {
    return useEditor({
        immediatelyRender: false,
        editable: props.disabled !== true,
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color,
            FontSize,
            TextAlign.configure({ types: ["heading", "paragraph", "image"] }),
            Link.configure({ openOnClick: false }),
            Document,
            Paragraph,
            Text,
            CustomImage,
            Dropcursor,
        ],
        content: props.content,
        onUpdate: props.onUpdate,
    }) as CustomEditor;
}