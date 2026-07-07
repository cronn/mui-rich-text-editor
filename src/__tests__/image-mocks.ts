import { vi } from "vitest";

interface MockImageDimensions {
    width: number;
    height: number;
}

/**
 * Stubs browser APIs used by `ImageUploadButton`'s resize pipeline that
 * jsdom does not implement: `Image` decoding, `<canvas>` 2D context, and
 * `toDataURL`. `FileReader.readAsDataURL` is natively supported by jsdom.
 */
export function mockImageApis(dimensions: MockImageDimensions): {
    restore: () => void;
    drawImageMock: ReturnType<typeof vi.fn>;
    toDataURLMock: ReturnType<typeof vi.fn>;
} {
    const OriginalImage = global.Image;

    class MockImage {
        public width = dimensions.width;
        public height = dimensions.height;
        public onload: (() => void) | null = null;
        private _src = "";

        public set src(value: string) {
            this._src = value;
            // Simulate async decode on next microtask, like a real Image.
            queueMicrotask(() => {
                this.onload?.();
            });
        }

        public get src(): string {
            return this._src;
        }
    }

    // @ts-expect-error -- partial mock sufficient for test purposes
    global.Image = MockImage;

    const drawImageMock = vi.fn();
    const toDataURLMock = vi.fn(() => "data:image/jpeg;base64,resizedmock");

    const getContextMock = vi
        .spyOn(HTMLCanvasElement.prototype, "getContext")
        .mockImplementation(
            () =>
                ({
                    drawImage: drawImageMock,
                }) as unknown as CanvasRenderingContext2D,
        );

    const toDataURLSpy = vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockImplementation(toDataURLMock);

    return {
        drawImageMock,
        toDataURLMock: toDataURLSpy,
        restore: () => {
            global.Image = OriginalImage;
            getContextMock.mockRestore();
            toDataURLSpy.mockRestore();
        },
    };
}

export function createFakeImageFile(name = "test.png", type = "image/png"): File {
    return new File(["fake-image-content"], name, { type });
}
