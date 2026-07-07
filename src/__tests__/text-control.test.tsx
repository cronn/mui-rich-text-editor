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
            <TextControl control={control} name="name" label="Name" useController={useTestFormController<FormValues>()} />
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
                <TextControl control={control} name="name" label="Name" useController={useTestFormController<FormValues>()} />
            ),
            { defaultValues: { name: "Alice" } },
        );

        expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
    });

    it("updates the field value on typing", async () => {
        const user = userEvent.setup();
        renderWithForm<FormValues>(({ control }) => (
            <TextControl control={control} name="name" label="Name" useController={useTestFormController<FormValues>()} />
        ));

        const input = screen.getByLabelText("Name");
        await user.type(input, "Bob");

        expect(input).toHaveValue("Bob");
    });

    it("trims the value on blur by default", async () => {
        const user = userEvent.setup();
        renderWithForm<FormValues>(({ control }) => (
            <TextControl control={control} name="name" label="Name" useController={useTestFormController<FormValues>()} />
        ));

        const input = screen.getByLabelText("Name");
        await user.type(input, "  Bob  ");
        await user.tab();

        await waitFor(() => {
            expect(input).toHaveValue("Bob");
        });
    });

    it("does not trim the value on blur when disableTrimOnBlur is set", async () => {
        const user = userEvent.setup();
        renderWithForm<FormValues>(({ control }) => (
            <TextControl
                control={control}
                name="name"
                label="Name"
                disableTrimOnBlur
                useController={useTestFormController<FormValues>()}
            />
        ));

        const input = screen.getByLabelText("Name");
        await user.type(input, "  Bob  ");
        await user.tab();

        await waitFor(() => {
            expect(input).toHaveValue("  Bob  ");
        });
    });

    it("applies formatValue when the value changes", async () => {
        const user = userEvent.setup();
        renderWithForm<FormValues>(({ control }) => (
            <TextControl
                control={control}
                name="name"
                label="Name"
                formatValue={(value) => value.toUpperCase()}
                useController={useTestFormController<FormValues>()}
            />
        ));

        const input = screen.getByLabelText("Name");
        await user.type(input, "bob");

        expect(input).toHaveValue("BOB");
    });

    it("applies formatDisplayedValue independently of the underlying value", () => {
        renderWithForm<FormValues>(
            ({ control }) => (
                <TextControl
                    control={control}
                    name="name"
                    label="Name"
                    formatDisplayedValue={(value) => `<${value}>`}
                    useController={useTestFormController<FormValues>()}
                />
            ),
            { defaultValues: { name: "Bob" } },
        );

        expect(screen.getByDisplayValue("<Bob>")).toBeInTheDocument();
    });

    it("renders a loading adornment when loading is true", () => {
        renderWithForm<FormValues>(({ control }) => (
            <TextControl control={control} name="name" label="Name" loading useController={useTestFormController<FormValues>()} />
        ));

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
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
            <TextControl control={control} name="name" label="Name" disabled useController={useTestFormController<FormValues>()} />
        ));

        expect(screen.getByLabelText("Name")).toBeDisabled();
    });
});
