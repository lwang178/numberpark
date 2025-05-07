'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const AdminPortRequestsPanel = () => {
  const { user, isLoaded } = useUser();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) return;

    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from('port_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching entries:', error);
      } else {
        setEntries(data);
      }

      setLoading(false);
    };

    fetchEntries();
  }, [isAdmin]);

  const handleUpdate = async (id: string, field: string, value: string) => {
    const { error } = await supabase
      .from('port_requests')
      .update({ [field]: value })
      .eq('id', id);

    if (error) {
      console.error('Error updating entry:', error);
    } else {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === id ? { ...entry, [field]: value } : entry
        )
      );
    }
  };

  if (!isLoaded) return <p className='p-4'>加载中 / Loading user...</p>;
  if (!isAdmin)
    return <p className='p-4 text-red-500'>❌ 无权限 / Unauthorized</p>;
  if (loading) return <p className='p-4'>加载中 / Loading data...</p>;

  return (
    <div className='mx-auto max-w-6xl p-6 font-mono'>
      <h1 className='mb-6 text-3xl font-bold'>
        🛠 管理用户套餐信息 / Admin Panel
      </h1>
      <div className='overflow-x-auto'>
        <table className='min-w-full border'>
          <thead>
            <tr className='bg-gray-100 text-left'>
              {[
                '用户 ID',
                '号码',
                '运营商',
                '状态',
                '月费',
                '下次扣费',
                'SIM 信息',
                '转网状态'
              ].map((header, idx) => (
                <th key={idx} className='border-b p-2'>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className='border-t'>
                <td className='border-b p-2'>{entry.user_id}</td>
                <td className='border-b p-2'>{entry.number}</td>
                <td className='border-b p-2'>
                  <input
                    className='w-full rounded border p-1'
                    value={entry.plan_carrier || ''}
                    onChange={(e) =>
                      handleUpdate(entry.id, 'plan_carrier', e.target.value)
                    }
                  />
                </td>
                <td className='border-b p-2'>
                  <input
                    className='w-full rounded border p-1'
                    value={entry.plan_status || ''}
                    onChange={(e) =>
                      handleUpdate(entry.id, 'plan_status', e.target.value)
                    }
                  />
                </td>
                <td className='border-b p-2'>
                  <input
                    type='number'
                    className='w-full rounded border p-1'
                    value={entry.plan_price || ''}
                    onChange={(e) =>
                      handleUpdate(entry.id, 'plan_price', e.target.value)
                    }
                  />
                </td>
                <td className='border-b p-2'>
                  <input
                    type='date'
                    className='w-full rounded border p-1'
                    value={entry.plan_next_bill?.split('T')[0] || ''}
                    onChange={(e) =>
                      handleUpdate(entry.id, 'plan_next_bill', e.target.value)
                    }
                  />
                </td>
                <td className='border-b p-2'>
                  <input
                    className='w-full rounded border p-1'
                    value={entry.sim_info || ''}
                    onChange={(e) =>
                      handleUpdate(entry.id, 'sim_info', e.target.value)
                    }
                  />
                </td>
                <td className='border-b p-2'>
                  <input
                    className='w-full rounded border p-1'
                    value={entry.plan_port_status || ''}
                    onChange={(e) =>
                      handleUpdate(entry.id, 'plan_port_status', e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPortRequestsPanel;
