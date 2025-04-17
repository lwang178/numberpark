'use client';

import Link from 'next/link';

export default function HistoryPage() {
  return (
    <main className='min-h-screen bg-white px-6 py-12'>
      <div className='mx-auto max-w-4xl'>
        {/* Header + CTA */}
        <div className='mb-10 flex flex-col md:flex-row md:items-center md:justify-between'>
          <h1 className='mb-4 text-3xl font-bold md:mb-0'>
            📜 我的保号申请记录
          </h1>
          <Link
            href='/dashboard/port-request'
            className='inline-block rounded-full bg-yellow-400 px-6 py-3 font-medium text-black transition hover:bg-yellow-500'
          >
            ➕ 发起新申请
          </Link>
        </div>

        {/* Table Placeholder */}
        <div className='overflow-x-auto rounded-lg border shadow-sm'>
          <table className='min-w-full text-left text-sm'>
            <thead className='bg-gray-100 text-gray-600 uppercase'>
              <tr>
                <th className='px-4 py-3'>姓名</th>
                <th className='px-4 py-3'>账号</th>
                <th className='px-4 py-3'>状态</th>
                <th className='px-4 py-3'>提交时间</th>
              </tr>
            </thead>
            <tbody className='text-gray-700'>
              {/* Example Row */}
              <tr className='border-t'>
                <td className='px-4 py-3'>张三</td>
                <td className='px-4 py-3'>123456789</td>
                <td className='px-4 py-3'>
                  <span className='inline-block rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700'>
                    待审核
                  </span>
                </td>
                <td className='px-4 py-3'>2024/04/18</td>
              </tr>
              {/* More rows would go here... */}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
