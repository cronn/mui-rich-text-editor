import { useEffect, useState } from "react";
import type { CustomEditor } from "./useCustomEditor";
import type { Align } from "./utils";

export interface ActiveMarks {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  fontColor?: string;
  fontSize?: string;
  textAlign?: Align;
  imageAlign?: Align;
  bulletList: boolean;
  orderedList: boolean;
  link: boolean;
}

export function useEditorActiveState(editor: CustomEditor): ActiveMarks {
  const [activeMarks, setActiveMarks] = useState<ActiveMarks>({
    bold: false,
    italic: false,
    underline: false,
    fontColor: undefined,
    fontSize: undefined,
    textAlign: undefined,
    imageAlign: undefined,
    bulletList: false,
    orderedList: false,
    link: false,
  });

  useEffect(() => {
    function updateActiveMarks() {
      if (!editor.isFocused) {
        return;
      }

      const textStyleAttrs = editor.getAttributes("textStyle") as {
        color?: string;
        fontSize?: string;
      };
      const paragraphAttrs = editor.getAttributes("paragraph") as {
        textAlign?: Align;
      };
      const imageAttrs = editor.getAttributes("customImage") as {
        align?: Align;
      };

      setActiveMarks({
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        underline: editor.isActive("underline"),
        fontColor: textStyleAttrs.color,
        fontSize: textStyleAttrs.fontSize,
        textAlign: paragraphAttrs.textAlign,
        imageAlign: imageAttrs.align,
        bulletList: editor.isActive("bulletList"),
        orderedList: editor.isActive("orderedList"),
        link: editor.isActive("link"),
      });
    }

    function deactivateMarks() {
      setActiveMarks({
        bold: false,
        italic: false,
        underline: false,
        fontColor: undefined,
        fontSize: undefined,
        textAlign: undefined,
        imageAlign: undefined,
        bulletList: false,
        orderedList: false,
        link: false,
      });
    }

    editor.on("selectionUpdate", updateActiveMarks);
    editor.on("transaction", updateActiveMarks);
    editor.on("focus", updateActiveMarks);
    editor.on("blur", deactivateMarks);

    if (editor.isFocused) {
      updateActiveMarks();
    } else {
      deactivateMarks();
    }

    return () => {
      editor.off("selectionUpdate", updateActiveMarks);
      editor.off("transaction", updateActiveMarks);
      editor.off("focus", updateActiveMarks);
      editor.off("blur", deactivateMarks);
    };
  }, [editor]);

  return activeMarks;
}
