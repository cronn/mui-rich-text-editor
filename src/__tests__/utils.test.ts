import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
    controlledValue,
    getNativeInputProps,
    getToolbarButtonColor,
    isDefined,
    isUndefined,
    useCustomForm,
} from "../lib/utils";

describe("isDefined / isUndefined", () => {
    it.each([
        [null, false],
        [undefined, false],
        [0, true],
        ["", true],
        [false, true],
        ["value", true],
    ])("isDefined(%p) === %p", (value, expected) => {
        expect(isDefined(value)).toBe(expected);
    });

    it.each([
        [null, true],
        [undefined, true],
        [0, false],
        ["", false],
        [false, false],
    ])("isUndefined(%p) === %p", (value, expected) => {
        expect(isUndefined(value)).toBe(expected);
    });
});

describe("controlledValue", () => {
    it.each([
        ["hello", "hello"],
        [42, "42"],
        [true, "true"],
        [false, "false"],
        [null, ""],
        [undefined, ""],
    ])("controlledValue(%p) === %p", (value, expected) => {
        expect(controlledValue(value)).toBe(expected);
    });
});

describe("getToolbarButtonColor", () => {
    it("returns 'primary' when active", () => {
        expect(getToolbarButtonColor(true)).toBe("primary");
    });

    it("returns 'default' when inactive", () => {
        expect(getToolbarButtonColor(false)).toBe("default");
    });
});

describe("getNativeInputProps", () => {
    it("returns undefined when inputMode is not set", () => {
        expect(getNativeInputProps({})).toBeUndefined();
    });

    it("returns an object with inputMode when set", () => {
        expect(getNativeInputProps({ inputMode: "numeric" })).toEqual({ inputMode: "numeric" });
    });
});

interface TestFormValues {
    name: string;
    nested: {
        age: number;
    };
}

describe("useCustomForm", () => {
    it("registerField returns control/name/rules for use with react-hook-form", () => {
        const { result } = renderHook(() => useCustomForm<TestFormValues>({ defaultValues: { name: "", nested: { age: 0 } } }));

        const registration = result.current.registerField("name", { required: "Required" });

        expect(registration.name).toBe("name");
        expect(registration.rules).toEqual({ required: "Required" });
        expect(registration.control).toBeDefined();
    });

    it("getValues reflects defaultValues", () => {
        const { result } = renderHook(() =>
            useCustomForm<TestFormValues>({ defaultValues: { name: "Alice", nested: { age: 30 } } }),
        );

        expect(result.current.getValues()).toEqual({ name: "Alice", nested: { age: 30 } });
    });

    it("trigger resolves to a boolean", async () => {
        const { result } = renderHook(() =>
            useCustomForm<TestFormValues>({ defaultValues: { name: "Alice", nested: { age: 30 } } }),
        );

        await expect(result.current.trigger()).resolves.toBe(true);
    });
});
