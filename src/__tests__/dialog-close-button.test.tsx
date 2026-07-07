import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DialogCloseButton } from "../components/DialogCloseButton";

describe("DialogCloseButton", () => {
  it("uses default translations for aria-label", () => {
    render(<DialogCloseButton onClick={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: "Abbrechen" }),
    ).toBeInTheDocument();
  });

  it("uses custom translations for aria-label when provided", () => {
    render(
      <DialogCloseButton
        onClick={vi.fn()}
        translations={{ cancel: "Cancel" }}
      />,
    );
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<DialogCloseButton onClick={onClick} />);

    await user.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("respects the disabled prop", () => {
    render(<DialogCloseButton onClick={vi.fn()} disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
