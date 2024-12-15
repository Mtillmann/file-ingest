export type FileIngestOptions = {
  target: string | HTMLElement,
  accept: string,
  paste: boolean,
  drop: boolean,
  change: boolean,
  dragClasses: Record<string, string | string[]>,
  preventDefault: boolean,
  applyDragClasses: boolean,
  ignorePasteOnInput: boolean,
  eventPrefix: string,
  eventTarget?: HTMLElement | string | null,
  callback?: Function | null,
  includeRejectedFiles?: boolean,
  emitWhenEmpty?: boolean
}
