import {
  Badge,
  Button,
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
} from '@design-token/react';

const variants = [
  { variant: 'outline', description: 'Border only' },
  { variant: 'elevated', description: 'Shadow md' },
  { variant: 'filled', description: 'Tinted surface' },
] as const;

export function CardShowcase() {
  return (
    <>
      <div className="frame">
        <div className="frame-label">Variant</div>
        <div className="showcase-grid">
          {variants.map(({ variant, description }) => (
            <Card key={variant} variant={variant}>
              <CardHeader>
                <CardTitle>{variant[0].toUpperCase() + variant.slice(1)}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardBody>Cards group related content and actions on a surface.</CardBody>
              <CardFooter>
                <Button size="sm" variant="ghost">
                  Cancel
                </Button>
                <Button size="sm">Confirm</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Interactive</div>
        <div className="showcase-grid">
          {['Starter', 'Pro'].map((plan) => (
            <Card key={plan} variant="outline" interactive tabIndex={0}>
              <CardHeader>
                <CardTitle>{plan}</CardTitle>
                <CardDescription>Hover or focus to lift the card</CardDescription>
              </CardHeader>
              <CardBody>
                <div>
                  <Badge color={plan === 'Pro' ? 'secondary' : 'primary'}>
                    {plan === 'Pro' ? 'Popular' : 'Free'}
                  </Badge>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Composition</div>
        <div className="showcase-grid">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>Use your work email to continue</CardDescription>
            </CardHeader>
            <CardBody>
              <Input type="email" placeholder="name@company.com" aria-label="Email" />
              <Input type="password" placeholder="Password" aria-label="Password" />
              <Checkbox defaultChecked>Remember me</Checkbox>
            </CardBody>
            <CardFooter>
              <Button>Sign in</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
