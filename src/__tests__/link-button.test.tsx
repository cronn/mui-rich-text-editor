import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { LinkButton } from "../components/LinkButton";
import type { LinkDialogFormValues } from "../components/LinkDialog";
import { createTestUseForm, useTestFormController } from "./rhf-harness";
import { runInAct, renderEditor } from "./render-editor";

afterEach(() => {
    cleanup();
});

async function renderLinkButton() {
    const { editor } = await renderEditor({ content: "<p>Hello world</p>" });
    const useForm = createTestUseForm<LinkDialogFormValues>({ url: "" });

    render(
        <LinkButton
            editor={editor}
            active={false}
            useForm={useForm}
            useUrlFieldController={useTestFormController()}
        />,
    );

    return { editor };
}

describe("LinkButton", () => {
    it("renders a link toolbar button", async () => {
        await renderLinkButton();
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("opens the LinkDialog when clicked", async () => {
        const user = userEvent.setup();
        await renderLinkButton();

        await user.click(screen.getByRole("button"));

        expect(screen.getByRole("heading", { name: "Link hinzufügen" })).toBeInTheDocument();
    });

    it("normalizes a bare domain by prefixing https:// when submitted", async () => {
        const user = userEvent.setup();
        const { editor } = await renderLinkButton();

        runInAct(() => {
            editor.commands.selectAll();
        });

        await user.click(screen.getByRole("button"));
        await user.type(screen.getByLabelText("Link-URL *"), "example.com");
        await user.click(screen.getByTestId("cta-button"));

        await waitFor(() => {
            expect(editor.getHTML()).toContain('href="https://example.com"');
        });
    });

    it("leaves an already-prefixed URL unchanged", async () => {
        const user = userEvent.setup();
        const { editor } = await renderLinkButton();

        runInAct(() => {
            editor.commands.selectAll();
        });

        await user.click(screen.getByRole("button"));
        await user.type(screen.getByLabelText("Link-URL *"), "http://example.com");
        await user.click(screen.getByTestId("cta-button"));

        await waitFor(() => {
            expect(editor.getHTML()).toContain('href="http://example.com"');
        });
    });

    it("closes the dialog after successful submit", async () => {
        const user = userEvent.setup();
        await renderLinkButton();

        await user.click(screen.getByRole("button"));
        await user.type(screen.getByLabelText("Link-URL *"), "example.com");
        await user.click(screen.getByTestId("cta-button"));

        await waitFor(() => {
            expect(screen.queryByRole("heading", { name: "Link hinzufügen" })).not.toBeInTheDocument();
        });
    });

    it("passes custom translations through to the tooltip and nested LinkDialog", async () => {
        const user = userEvent.setup();
        const { editor } = await renderEditor({ content: "<p>Hello world</p>" });
        const useForm = createTestUseForm<LinkDialogFormValues>({ url: "" });

        render(
            <LinkButton
                editor={editor}
                active={false}
                useForm={useForm}
                useUrlFieldController={useTestFormController()}
                translations={{
                    tooltip: "Add a link",
                    linkDialog: {
                        title: "Insert Link",
                        urlLabel: "URL",
                        urlRequiredMessage: "Required",
                        ctaLabel: "Insert",
                    },
                }}
            />,
        );

        await user.click(screen.getByRole("button"));

        expect(screen.getByRole("heading", { name: "Insert Link" })).toBeInTheDocument();
    });
});
