import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LinkDialog } from "../components/LinkDialog";

function renderLinkDialog(
  overrides: Partial<Parameters<typeof LinkDialog>[0]> = {},
) {
  const onSubmit = vi.fn();
  const onClose = vi.fn();

  const renderResult = render(
    <LinkDialog open onSubmit={onSubmit} onClose={onClose} {...overrides} />,
  );

  return { onSubmit, onClose, ...renderResult };
}

describe("LinkDialog", () => {
  it("renders the title, URL field and CTA button using default translations", () => {
    renderLinkDialog();

    expect(
      screen.getByRole("heading", { name: "Link hinzufügen" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Link-URL *")).toBeInTheDocument();
    expect(screen.getByTestId("cta-button")).toHaveTextContent(
      "Link hinzufügen",
    );
  });

  it("uses custom translations when provided", () => {
    renderLinkDialog({
      translations: {
        title: "Add Link",
        urlLabel: "URL",
        urlRequiredMessage: "URL required",
        ctaLabel: "Add",
      },
    });

    expect(screen.getByText("Add Link")).toBeInTheDocument();
    expect(screen.getByLabelText("URL *")).toBeInTheDocument();
    expect(screen.getByTestId("cta-button")).toHaveTextContent("Add");
  });

  it("shows a validation error and does not submit when the URL is empty", async () => {
    const user = userEvent.setup();
    const { onSubmit, onClose } = renderLinkDialog();

    await user.click(screen.getByTestId("cta-button"));

    await waitFor(() => {
      expect(screen.getByText("Bitte eine URL eingeben.")).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onSubmit with the URL and onClose when valid", async () => {
    const user = userEvent.setup();
    const { onSubmit, onClose } = renderLinkDialog();

    await user.type(screen.getByLabelText("Link-URL *"), "example.com");
    await user.click(screen.getByTestId("cta-button"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith("example.com");
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the close (X) button is clicked", async () => {
    const user = userEvent.setup();
    const { onClose } = renderLinkDialog();

    await user.click(screen.getByRole("button", { name: "Abbrechen" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
