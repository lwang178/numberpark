'use server';

import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function HistoryPage() {
  const { userId } = auth();

  if (!userId) {
    return (
      <div className='py-20 text-center text-gray-500'>
        未登录，请重新登录。
      </div>
    );
  }

  const requests = await prisma.portRequest.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

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

        {/* History Table */}
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
              {requests.map((req) => (
                <tr key={req.id} className='border-t'>
                  <td className='px-4 py-3'>{req.firstName}</td>
                  <td className='px-4 py-3'>{req.accountNumber}</td>
                  <td className='px-4 py-3'>
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                        req.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : req.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : req.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : req.status === 'processing'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className='px-4 py-3'>
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={4} className='py-6 text-center text-gray-400'>
                    暂无申请记录。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
