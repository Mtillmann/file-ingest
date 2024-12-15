type FileIngestOptions = {
    target: string | HTMLElement;
    accept: string;
    paste: boolean;
    drop: boolean;
    change: boolean;
    dragClasses: Record<string, string | string[]>;
    preventDefault: boolean;
    applyDragClasses: boolean;
    ignorePasteOnInput: boolean;
    eventPrefix: string;
    eventTarget?: HTMLElement | string | null;
    callback?: Function | null;
    includeRejectedFiles?: boolean;
    emitWhenEmpty?: boolean;
};

declare class FileIngest {
    defaultOptions: FileIngestOptions;
    target: HTMLElement;
    eventTarget: HTMLElement | string | null;
    options: FileIngestOptions;
    acceptedMimeTypes: Record<string, string[]>;
    constructor(options?: Partial<FileIngestOptions>);
    private expandAcceptedMimeTypes;
    private dragenterHandler;
    private dragoverHandler;
    private dragleaveHandler;
    private dropHandler;
    private changeHandler;
    private pasteHandler;
    registerPasteHandler(): void;
    unregisterPasteHandler(): void;
    registerDropHandler(): void;
    unregisterDropHandler(): void;
    registerChangeHandler(): void;
    unregisterChangeHandler(): void;
    handleFiles(files: File[]): void;
    destroy(): void;
}

export { type FileIngestOptions, FileIngest as default };
