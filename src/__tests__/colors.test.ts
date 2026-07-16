import { describe, expect, it } from "vitest";

import { Colors } from "../lib/colors";

describe("Colors", () => {
  it("exposes exactly the 9 expected named colors", () => {
    expect(Object.keys(Colors)).toEqual([
      "Black",
      "Gray",
      "Red",
      "Blue",
      "Turquoise",
      "Green",
      "Orange",
      "Purple",
      "Pink",
    ]);
  });

  it.each(Object.entries(Colors))(
    "has a valid hex value for %s",
    (_name, value) => {
      expect(value).toMatch(/^#[0-9a-fA-F]{6,8}$/);
    },
  );

  it("has unique color values", () => {
    const values = Object.values(Colors);
    expect(new Set(values).size).toBe(values.length);
  });
});
