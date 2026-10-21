import { useState } from 'react';
import { Combobox, Field, type ComboboxOption } from '@design-token/react';

const cities: ComboboxOption[] = [
  { value: 'seoul', label: 'Seoul', hint: 'KR' },
  { value: 'busan', label: 'Busan', hint: 'KR' },
  { value: 'tokyo', label: 'Tokyo', hint: 'JP' },
  { value: 'osaka', label: 'Osaka', hint: 'JP' },
  { value: 'newyork', label: 'New York', hint: 'US' },
  { value: 'sf', label: 'San Francisco', hint: 'US' },
  { value: 'london', label: 'London', hint: 'UK' },
  { value: 'paris', label: 'Paris', hint: 'FR' },
  { value: 'berlin', label: 'Berlin', hint: 'DE', disabled: true },
  { value: 'sydney', label: 'Sydney', hint: 'AU' },
];

export function ComboboxShowcase() {
  const [city, setCity] = useState<string | null>('seoul');

  return (
    <>
      <div className="frame">
        <div className="frame-label">Searchable select</div>
        <div className="showcase-stack">
          <Field label="City" hint={`Selected: ${city ?? 'none'}`}>
            <Combobox options={cities} value={city} onValueChange={setCity} placeholder="Search cities" />
          </Field>
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Size & State</div>
        <div className="showcase-stack">
          <Combobox options={cities} size="sm" placeholder="Small" aria-label="Small" />
          <Combobox options={cities} size="lg" placeholder="Large" aria-label="Large" />
          <Combobox options={cities} invalid placeholder="Invalid" aria-label="Invalid" />
          <Combobox options={cities} disabled placeholder="Disabled" aria-label="Disabled" />
        </div>
      </div>
    </>
  );
}
