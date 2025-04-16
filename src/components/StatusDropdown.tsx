'use client';

import { useTransition } from 'react';

type Props = {
  id: string;
  currentStatus: string;
};

export function StatusDropdown({ id, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;

    startTransition(async () => {
      const res = await fetch('/admin/update-status', {
        method: 'POST',
        body: JSON.stringify({ id, status: newStatus }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        alert('Failed to update status');
      }
    });
  };

  return (
    <select
      defaultValue={currentStatus}
      onChange={handleChange}
      className='rounded border border-gray-300 px-2 py-1 text-sm capitalize'
      disabled={isPending}
    >
      {['pending', 'processing', 'complete'].map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
