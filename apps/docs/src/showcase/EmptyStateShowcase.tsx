import { FileSearch, FolderOpen, Inbox } from 'lucide-react';
import { Button, EmptyState } from '@design-token/react';

export function EmptyStateShowcase() {
  return (
    <>
      <div className="frame">
        <div className="frame-label">With actions</div>
        <div className="showcase-panel is-wide">
          <EmptyState
            icon={<FolderOpen />}
            title="No projects yet"
            description="Create your first project to start organizing your design tokens."
            actions={
              <>
                <Button variant="outline">Import</Button>
                <Button>New project</Button>
              </>
            }
          />
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Bordered · Minimal</div>
        <div className="showcase-grid">
          <EmptyState bordered icon={<Inbox />} title="Inbox zero" description="You're all caught up." />
          <EmptyState
            bordered
            icon={<FileSearch />}
            title="No results"
            description="Try a different search term."
            actions={
              <Button size="sm" variant="ghost">
                Clear search
              </Button>
            }
          />
        </div>
      </div>
    </>
  );
}
