import { useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@design-token/react';

export function SkeletonShowcase() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <div className="frame">
        <div className="frame-label">Shapes</div>
        <div className="showcase-stack is-wide">
          <Skeleton />
          <Skeleton lines={3} />
          <div className="frame-body">
            <Skeleton variant="circle" width={40} />
            <Skeleton variant="rect" width={160} height={80} />
          </div>
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Loading card</div>
        <div className="frame-body">
          <Button size="sm" variant="outline" onClick={() => setLoading((l) => !l)}>
            {loading ? 'Show content' : 'Show skeleton'}
          </Button>
        </div>
        <div className="showcase-grid" style={{ marginTop: 12 }}>
          <Card>
            {loading ? (
              <>
                <div className="skeleton-header">
                  <Skeleton variant="circle" width={40} />
                  <div style={{ flex: 1 }}>
                    <Skeleton lines={2} />
                  </div>
                </div>
                <Skeleton variant="rect" height={100} />
              </>
            ) : (
              <>
                <div className="skeleton-header">
                  <Avatar name="Kim Minji" size="lg" />
                  <CardHeader>
                    <CardTitle>Kim Minji</CardTitle>
                    <CardDescription>Product designer</CardDescription>
                  </CardHeader>
                </div>
                <CardBody>Working on the new design token system and component library.</CardBody>
              </>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
