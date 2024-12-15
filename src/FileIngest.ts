import type { FileIngestOptions } from './FileIngestOptions'

export default class FileIngest {
  defaultOptions: FileIngestOptions = {
    target: document.documentElement,
    accept: '*/*',
    paste: true,
    drop: true,
    change: true,
    preventDefault: true,
    dragClasses: {
      dragover: 'file-ingest-dragover',
      dragenter: 'file-ingest-dragenter',
      dragleave: 'file-ingest-dragleave',
      drop: 'file-ingest-drop'
    },
    ignorePasteOnInput: true,
    eventPrefix: 'file-ingest',
    applyDragClasses: true,
    eventTarget: null,
    callback: null,
    includeRejectedFiles: false,
    emitWhenEmpty: false
  }

  target: HTMLElement

  eventTarget: HTMLElement | string | null

  options: FileIngestOptions

  acceptedMimeTypes: Record<string, string[]>

  constructor (options: Partial<FileIngestOptions> = {}) {
    this.options = { ...this.defaultOptions, ...options }

    if (typeof this.options.target === 'string') {
      this.target = document.querySelector(this.options.target) as HTMLElement
    } else {
      this.target = this.options.target
    }

    if (!this.target) {
      throw new Error('FileIngest: target not found')
    }

    if (typeof this.options.eventTarget === 'string') {
      this.eventTarget = document.querySelector(this.options.eventTarget) as HTMLElement
    } else if (this.options.eventTarget instanceof HTMLElement) {
      this.eventTarget = this.options.eventTarget
    } else {
      this.eventTarget = this.target
    }

    if (!this.eventTarget) {
      throw new Error('FileIngest: eventTarget not found')
    }

    this.acceptedMimeTypes = this.expandAcceptedMimeTypes(this.options.accept)

    for (const key in this.options.dragClasses) {
      if (typeof this.options.dragClasses[key] === 'string') {
        this.options.dragClasses[key] = [this.options.dragClasses[key]]
      }
    }

    if (this.options.paste) {
      this.registerPasteHandler()
    }

    if (this.options.drop) {
      this.registerDropHandler()
    }

    if (this.options.change) {
      this.registerChangeHandler()
    }
  }

  private expandAcceptedMimeTypes (accept: string = '*/*'):Record<string, string[]> {
    if (accept === '*/*') {
      return { '*': ['*'] }
    }

    return accept.split(/\s*,\s*/).map((pair) => pair.split('/'))
      .reduce((acc:Record<string, string[]>, pair) => {
        const [type, subtype] = pair
        if (!acc[type]) {
          acc[type] = []
        }
        acc[type].push(subtype)

        if (acc[type].includes('*')) {
          acc[type] = ['*']
        }

        return acc
      }, {})
  }

  private dragenterHandler = (e: DragEvent) => {
    if (this.options.preventDefault) {
      e.preventDefault()
    }

    if (this.options.applyDragClasses) {
      this.target.classList.add(...this.options.dragClasses.drop)
    }
  }

  private dragoverHandler = (e: DragEvent) => {
    if (this.options.preventDefault) {
      e.preventDefault()
    }

    e.dataTransfer!.dropEffect = 'copy'

    if (this.options.applyDragClasses) {
      this.target.classList.add(...this.options.dragClasses.dragover)
    }
  }

  private dragleaveHandler = (e: DragEvent) => {
    if (this.options.preventDefault) {
      e.preventDefault()
    }

    if (this.options.applyDragClasses) {
      this.target.classList.remove(...this.options.dragClasses.dragenter)
      this.target.classList.remove(...this.options.dragClasses.dragover)
    }
  }

  private dropHandler = (e: DragEvent) => {
    if (this.options.preventDefault) {
      e.preventDefault()
    }

    if (this.options.applyDragClasses) {
      this.target.classList.remove(...this.options.dragClasses.dragenter)
      this.target.classList.remove(...this.options.dragClasses.dragover)
    }

    const files:File[] = [...e.dataTransfer!.files]

    if (files.length > 0) {
      return this.handleFiles(files)
    }
  }

  private changeHandler = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (!target.files || !target.getAttribute('type') || target.getAttribute('type') !== 'file') {
      return
    }

    if (this.options.preventDefault) {
      e.preventDefault()
    }

    const files:File[] = [...target.files!]

    if (files.length > 0) {
      return this.handleFiles(files)
    }
  }

  private pasteHandler = (e: ClipboardEvent) => {
    if (this.options.ignorePasteOnInput && e.target && ((e.target as Element).matches('input, textarea') || (e.target as Element).getAttribute('contenteditable') === 'true')) {
      return
    }

    if (this.options.preventDefault) {
      e.preventDefault()
    }

    const files:File[] = [...e.clipboardData!.items]
      .reduce((acc:File[], item:DataTransferItem) => {
        if (item.kind === 'file') {
          acc.push(item.getAsFile()!)
        }
        return acc
      }, [])

    if (files.length > 0) {
      return this.handleFiles(files)
    }
  }

  registerPasteHandler () {
    document.addEventListener('paste', this.pasteHandler)
  }

  unregisterPasteHandler () {
    document.removeEventListener('paste', this.pasteHandler)
  }

  registerDropHandler () {
    this.target.addEventListener('dragenter', this.dragenterHandler)
    this.target.addEventListener('dragover', this.dragoverHandler)
    this.target.addEventListener('dragleave', this.dragleaveHandler)
    this.target.addEventListener('drop', this.dropHandler)
  }

  unregisterDropHandler () {
    this.target.removeEventListener('dragenter', this.dragenterHandler)
    this.target.removeEventListener('dragover', this.dragoverHandler)
    this.target.removeEventListener('dragleave', this.dragleaveHandler)
    this.target.removeEventListener('drop', this.dropHandler)
  }

  registerChangeHandler () {
    this.target.addEventListener('change', this.changeHandler)
  }

  unregisterChangeHandler () {
    this.target.removeEventListener('change', this.changeHandler)
  }

  handleFiles (files: File[]) {
    const detail:Record<string, File[]> = { files: [], rejected: [] }

    for (const file of files) {
      if (this.acceptedMimeTypes['*']) {
        detail.files.push(file)
        continue
      }

      const [type, subtype] = file.type.split('/')
      if (this.acceptedMimeTypes[type] && (this.acceptedMimeTypes[type].includes(subtype) || this.acceptedMimeTypes[type].includes('*'))) {
        detail.files.push(file)
      } else {
        detail.rejected.push(file)
      }
    }

    if (detail.files.length === 0 && !this.options.emitWhenEmpty) {
      return
    }

    if (!this.options.includeRejectedFiles) {
      delete detail.rejected
    }

    (this.eventTarget as HTMLElement).dispatchEvent(new CustomEvent(`${this.options.eventPrefix}:files`, { detail }))
    if (this.options.callback) {
      this.options.callback(detail)
    }
  }

  destroy () {
    if (this.options.paste) {
      this.unregisterPasteHandler()
    }

    if (this.options.drop) {
      this.unregisterDropHandler()
    }

    if (this.options.change) {
      this.unregisterChangeHandler()
    }
  }
}
