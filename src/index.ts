"use client";

export { RichTextControl } from "./components/RichTextControl";
export type {
  RichTextControlProps,
  RichTextControlHandle,
  FieldRegistration,
} from "./components/RichTextControl";

export { RichTextViewer } from "./components/RichTextViewer";

export type { EditorToolbarTranslations } from "./components/EditorToolbar";
export type { AlignToggleButtonGroupTranslations } from "./components/AlignToggleButtonGroup";
export type { FontColorDropdownTranslations } from "./components/FontColorDropdown";
export type { FontSizeDropdownTranslations } from "./components/FontSizeDropdown";
export type { ImageUploadButtonTranslations } from "./components/ImageUploadButton";
export type { LinkButtonTranslations } from "./components/LinkButton";
export type { LinkDialogTranslations } from "./components/LinkDialog";

export type { ActiveMarks } from "./lib/useEditorActiveState";

export { useCustomForm } from "./lib/utils";
export type { UseControllerHook, UseCustomFormReturn } from "./lib/utils";
