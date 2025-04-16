import { getAuth } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function HistoryPage() {
  const authHeaders = await headers();
  const { userId } = getAuth({ headers: authHeaders });

  if (!userId) {
    return <div>Not authorized</div>;
  }

  const requests = await prisma.portRequest.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className='mx-auto max-w-4xl p-6'>
      <h1 className='mb-6 text-2xl font-bold'>📜 Your Porting History</h1>

      {requests.length === 0 ? (
        <p className='text-gray-500'>
          You haven’t submitted any port requests yet.
        </p>
      ) : (
        <table className='w-full border text-sm'>
          <thead className='bg-gray-100 text-left'>
            <tr>
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
                <td className='p-2'>
                  {r.firstName} {r.lastName}
                </td>
                <td className='p-2'>{r.city}</td>
                <td className='p-2'>{r.state}</td>
                <td className='p-2 capitalize'>{r.status}</td>
                <td className='p-2'>
                  {new Date(r.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
