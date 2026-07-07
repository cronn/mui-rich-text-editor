import "@testing-library/jest-dom/vitest";

// jsdom does not implement layout, so ProseMirror's `Range.getClientRects`/
// `getBoundingClientRect` (used e.g. by `scrollIntoView` and coordinate
// calculations) are missing. Stub them so tiptap/ProseMirror editors can be
// mounted and interacted with in tests without throwing.
if (typeof Range !== "undefined") {
  if (typeof Range.prototype.getClientRects !== "function") {
    Range.prototype.getClientRects = () =>
      ({
        item: () => null,
        length: 0,
        [Symbol.iterator]: function* () {},
      }) as unknown as DOMRectList;
  }
  if (typeof Range.prototype.getBoundingClientRect !== "function") {
    Range.prototype.getBoundingClientRect = () =>
      ({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON: () => ({}),
      }) as DOMRect;
  }
}

if (
  typeof Element !== "undefined" &&
  typeof Element.prototype.scrollIntoView !== "function"
) {
  Element.prototype.scrollIntoView = () => {};
}

// jsdom does not implement layout, so `document.elementFromPoint` (used by
// ProseMirror to resolve a document position from mouse coordinates on
// mousedown) is missing. Returning `null` mirrors what happens in a real
// browser when the coordinates don't hit any element, which ProseMirror
// handles gracefully.
if (
  typeof document !== "undefined" &&
  typeof document.elementFromPoint !== "function"
) {
  document.elementFromPoint = () => null;
}