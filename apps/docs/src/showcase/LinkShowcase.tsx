import { Link } from '@design-token/react';

const prevent = (e: React.MouseEvent) => e.preventDefault();

export function LinkShowcase() {
  return (
    <>
      <div className="frame">
        <div className="frame-label">Inline</div>
        <p className="showcase-prose">
          Read the{' '}
          <Link href="#" onClick={prevent}>
            getting started guide
          </Link>{' '}
          or browse the{' '}
          <Link href="#" color="secondary" onClick={prevent}>
            component list
          </Link>
          . Links in body text can also{' '}
          <Link href="#" color="inherit" underline="always" onClick={prevent}>
            inherit the text color
          </Link>
          .
        </p>
      </div>

      <div className="frame">
        <div className="frame-label">Underline & External</div>
        <div className="frame-body">
          <Link href="#" onClick={prevent}>
            Underline on hover
          </Link>
          <Link href="#" underline="always" onClick={prevent}>
            Always underlined
          </Link>
          <Link href="https://example.com" external>
            External link
          </Link>
          <Link href="#" color="danger" onClick={prevent}>
            Danger link
          </Link>
        </div>
      </div>
    </>
  );
}
