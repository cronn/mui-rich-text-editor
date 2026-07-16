import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { TextControl } from "../components/TextControl";
import { renderWithForm, useTestFormController } from "./rhf-harness";

interface FormValues {
  name: string;
}

describe("TextControl", () => {
  it("renders the label", () => {
    renderWithForm<FormValues>(({ control }) => (
      <TextControl
        control={control}
        name="name"
        label="Name"
        useController={useTestFormController<FormValues>()}
      />
    ));

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("appends a '*' to the label when the field is required", () => {
    renderWithForm<FormValues>(({ control }) => (
      <TextControl
        control={control}
        name="name"
        label="Name"
        rules={{ required: "Required" }}
        useController={useTestFormController<FormValues>()}
      />
    ));

    expect(screen.getByLabelText("Name *")).toBeInTheDocument();
  });

  it("displays the initial field value", () => {
    renderWithForm<FormValues>(
      ({ control }) => (
        <TextControl
          control={control}
          name="name"
          label="Name"
          useController={useTestFormController<FormValues>()}
        />
      ),
      { defaultValues: { name: "Alice" } },
    );

    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
  });

  it("updates the field value on typing", async () => {
    const user = userEvent.setup();
    renderWithForm<FormValues>(({ control }) => (
      <TextControl
        control={control}
        name="name"
        label="Name"
        useController={useTestFormController<FormValues>()}
      />
    ));

    const input = screen.getByLabelText("Name");
    await user.type(input, "Bob");

    expect(input).toHaveValue("Bob");
  });

  it("trims the value on blur", async () => {
    const user = userEvent.setup();
    renderWithForm<FormValues>(({ control }) => (
      <TextControl
        control={control}
        name="name"
        label="Name"
        useController={useTestFormController<FormValues>()}
      />
    ));

    const input = screen.getByLabelText("Name");
    await user.type(input, "  Bob  ");
    await user.tab();

    await waitFor(() => {
      expect(input).toHaveValue("Bob");
    });
  });

  it("shows helperText and marks the field as errored on validation failure", async () => {
    const user = userEvent.setup();
    renderWithForm<FormValues>(({ control }) => (
      <TextControl
        control={control}
        name="name"
        label="Name"
        rules={{ required: "Name is required" }}
        useController={useTestFormController<FormValues>()}
      />
    ));

    const input = screen.getByLabelText("Name *");
    await user.click(input);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
  });

  it("disables the input when disabled prop is true", () => {
    renderWithForm<FormValues>(({ control }) => (
      <TextControl
        control={control}
        name="name"
        label="Name"
        disabled
        useController={useTestFormController<FormValues>()}
      />
    ));

    expect(screen.getByLabelText("Name")).toBeDisabled();
  });
});
