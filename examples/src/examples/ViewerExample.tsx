import { RichTextViewer } from "@cronn/mui-rich-text-editor";

const sampleHtml = [
  "<p>This is <strong>bold</strong>, <em>italic</em>, and <u>underlined</u> text.</p>",
  "<ul><li>First bullet point</li><li>Second bullet point</li></ul>",
  "<ol><li>Numbered item one</li><li>Numbered item two</li></ol>",
].join("");

export function ViewerExample() {
  return <RichTextViewer value={sampleHtml} />;
}
