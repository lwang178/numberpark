import { getAuth } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { StatusDropdown } from '@/components/StatusDropdown';

const prisma = new PrismaClient();
const ADMIN_IDS = ['user_2vmSdqGLddgopTSLeGKl9sKcAe1'];

export default async function AdminPage() {
  const authHeaders = await headers();
  const { userId } = getAuth({ headers: authHeaders });

  if (!userId || !ADMIN_IDS.includes(userId)) {
    redirect('/sign-in');
  }

  const requests = await prisma.portRequest.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className='mx-auto max-w-6xl p-6'>
      <h1 className='mb-6 text-3xl font-bold'>
        📡 Admin Portal: All Port Requests
      </h1>

      <table className='w-full border text-sm'>
        <thead className='bg-gray-100 text-left'>
          <tr>
            <th className='p-2'>User</th>
            <th className='p-2'>Name</th>
            <th className='p-2'>City</th>
            <th className='p-2'>State</th>
            <th className='p-2'>Status</th>
            <th className='p-2'>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id} className='border-t'>
              <td className='p-2 text-gray-500'>{r.userId}</td>
              <td className='p-2'>
                {r.firstName} {r.lastName}
              </td>
              <td className='p-2'>{r.city}</td>
              <td className='p-2'>{r.state}</td>
              <td className='p-2'>
                <StatusDropdown id={r.id} currentStatus={r.status} />
              </td>
              <td className='p-2'>{new Date(r.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
