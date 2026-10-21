import { Field, FileUpload } from '@design-token/react';

export function FileUploadShowcase() {
  return (
    <>
      <div className="frame">
        <div className="frame-label">Multiple files</div>
        <div className="showcase-stack is-wide">
          <FileUpload hint="PNG, JPG or PDF up to 5 MB" accept="image/*,.pdf" maxSize={5 * 1024 * 1024} />
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Single file · Disabled</div>
        <div className="showcase-grid">
          <Field label="Avatar">
            <FileUpload multiple={false} accept="image/*" hint="One image" />
          </Field>
          <Field label="Attachments">
            <FileUpload disabled hint="Uploads are disabled" />
          </Field>
        </div>
      </div>
    </>
  );
}
