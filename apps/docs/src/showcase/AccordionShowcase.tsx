import { Accordion, type AccordionItem } from '@design-token/react';

const faq: AccordionItem[] = [
  {
    value: 'what',
    title: 'What are design tokens?',
    content: 'Named values for color, type, spacing and more, shared between design and code.',
  },
  {
    value: 'modes',
    title: 'Can light and dark mode differ?',
    content: 'Yes. Every settings section keeps separate values for light and dark.',
  },
  {
    value: 'export',
    title: 'How do I use them in my app?',
    content: 'Each token is a CSS variable such as --dt-primary or --dt-space-md.',
  },
  { value: 'locked', title: 'Enterprise options', content: 'Contact sales.', disabled: true },
];

export function AccordionShowcase() {
  return (
    <>
      <div className="frame">
        <div className="frame-label">Contained · single</div>
        <div className="showcase-stack is-wide">
          <Accordion items={faq} defaultValue={['what']} />
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Separated · multiple</div>
        <div className="showcase-stack is-wide">
          <Accordion items={faq} type="multiple" variant="separated" />
        </div>
      </div>
    </>
  );
}
