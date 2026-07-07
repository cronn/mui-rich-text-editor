import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LoadingAdornment } from "../components/LoadingAdornment";

describe("LoadingAdornment", () => {
    it("renders a progress spinner when loading is true", () => {
        render(<LoadingAdornment loading={true} />);
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("does not render a progress spinner when loading is false", () => {
        render(<LoadingAdornment loading={false} />);
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("renders children alongside the spinner", () => {
        render(
            <LoadingAdornment loading={true}>
                <span>adornment child</span>
            </LoadingAdornment>,
        );
        expect(screen.getByText("adornment child")).toBeInTheDocument();
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
});
