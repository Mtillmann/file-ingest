# File Ingest

A simple class to ingest [files](https://developer.mozilla.org/en-US/docs/Web/API/File) in the browser by drag and drop, copy and paste or file input.

## Usage

Install the package:

```bash
npm install @mtillmann/file-ingest
```

After creating an instance, you'll receive a custom event `file-ingest:files` on the target element with the files as `event.detail.files`. 

- `event.detail.files` contains an array of files that passed the `accept`-option's MIME type check. 
- Set the `includeRejectedFiles`-option to `true` to include rejected files in `event.detail.rejected`. 
- If you set the `emitWhenEmpty`-option to `true`, the event will be emitted even when no matched files are present.

### Bundler

```javascript
import FileIngest from '@mtillmann/file-ingest';

const fileIngest = new FileIngest();

document.documentElement.addEventListener('file-ingest:files', (event) => {
  console.log(event.detail.files);
});
```

### Module Script Tag

```html
<script type="module">
  import FileIngest from '.../@mtillmann/file-ingest/dist/index.js';

  const fileIngest = new FileIngest();

  document.documentElement.addEventListener('file-ingest:files', (event) => {
    console.log(event.detail.files);
  });
</script>
```

### Classic Script Tag

```html
<script src=".../@mtillmann/file-ingest/dist/index.umd.js"></script>
<script>
  const fileIngest = new FileIngest();

  document.documentElement.addEventListener('file-ingest:files', (event) => {
    console.log(event.detail.files);
  });
</script>
```



## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| target | `String\|HTMLElement` | `document.documentElement` | Element or Selector String to attach the events to |
| accept | `string` | `*/*` | List of MIME types that are accepted by the instance. Supports wildcard subtypes (e.g. `image/*`) |
| paste | `boolean` | `true` | Enable or disable paste events |
| drop | `boolean` | `true` | Enable or disable drop events |
| change | `boolean` | `true` | Enable or disable change-events on `[type=file]`-inputs |
| preventDefault | `boolean` | `true` | Prevent the default behavior of the events |
| dragClasses | `Record\<string, string \| string[]\>` | `...` | Classes to add and remove on drag events |
| applyDragClasses | `boolean` | `true` | Apply drag classes to the target element |
| ignorePasteOnInput | `boolean` | `true` | Ignore paste events on input, textarea and `[contenteditable=true]`-elements |
| eventPrefix | `string` | `file-ingest` | Prefix for the custom events |
| eventTarget | `String\|HTMLElement` | `options.target` | Element to dispatch the custom events on |
| callback | `Function` | `null` | Callback function to call in addition to events - receives the content of `event.detail` as argument |
| includeRejectedFiles | `boolean` | `false` | Include rejected files in the event detail - useful for error messages etc. |
| emitWhenEmpty | `boolean` | `false` | Emit event even when no (matched) files are present |


## API

### `destroy()`

Removes all event listeners and cleans up the instance.