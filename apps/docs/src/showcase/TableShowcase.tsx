import { useState } from 'react';
import { Avatar, Badge, Pagination, Table, type Color, type TableColumn } from '@design-token/react';

interface Member {
  id: number;
  name: string;
  role: string;
  status: 'Active' | 'Invited' | 'Suspended';
  projects: number;
}

const statusColor: Record<Member['status'], Color> = {
  Active: 'success',
  Invited: 'info',
  Suspended: 'danger',
};

const names = ['Kim Minji', 'Lee Jun', 'Park Seoyeon', 'Choi Hyun', 'Jung Yuna', 'Kang Doyoon', 'Yoon Seo', 'Han Jiwoo'];
const roles = ['Designer', 'Developer', 'Product manager', 'Researcher'];
const statuses: Member['status'][] = ['Active', 'Active', 'Invited', 'Active', 'Suspended'];

const members: Member[] = Array.from({ length: 48 }, (_, i) => ({
  id: i + 1,
  name: names[i % names.length],
  role: roles[(i * 3) % roles.length],
  status: statuses[i % statuses.length],
  projects: (i * 7) % 23,
}));

const columns: TableColumn<Member>[] = [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
    render: (m) => (
      <span className="table-person">
        <Avatar name={m.name} size="sm" />
        {m.name}
      </span>
    ),
  },
  { key: 'role', header: 'Role', sortable: true },
  {
    key: 'status',
    header: 'Status',
    render: (m) => (
      <Badge color={statusColor[m.status]} pill size="sm">
        {m.status}
      </Badge>
    ),
  },
  { key: 'projects', header: 'Projects', align: 'right', sortable: true },
];

const PAGE_SIZE = 6;

export function TableShowcase() {
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(members.length / PAGE_SIZE);
  const rows = members.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="frame">
        <div className="frame-label">Table + Pagination</div>
        <div className="showcase-table">
          <Table columns={columns} rows={rows} rowKey={(m) => m.id} caption="Team members" />
          <div className="showcase-table-footer">
            <span className="showcase-note">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, members.length)} of {members.length}
            </span>
            <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
          </div>
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Compact · Striped</div>
        <div className="showcase-table">
          <Table columns={columns.slice(1)} rows={members.slice(0, 5)} rowKey={(m) => m.id} density="compact" striped />
        </div>
      </div>

      <div className="frame">
        <div className="frame-label">Empty</div>
        <div className="showcase-table">
          <Table columns={columns} rows={[]} rowKey={(m) => m.id} empty="No members match your filters" />
        </div>
      </div>
    </>
  );
}
