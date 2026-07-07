import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RichTextEditor } from "../components/RichTextEditor";

describe("RichTextEditor", () => {
  it("renders the placeholder text", () => {
    render(<RichTextEditor />);

    expect(
      screen.getByText("I am still a work in progress"),
    ).toBeInTheDocument();
  });
});
