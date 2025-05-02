'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@clerk/nextjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const maskNumber = (number: string): string => {
  if (!number || number.length !== 10) return number;
  return `${number.slice(0, 3)}****${number.slice(-3)}`;
};

const ReferralTrackerPage = () => {
  const { user } = useUser();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchReferrals = async () => {
      setLoading(true);

      const { data: myRequests, error: myError } = await supabase
        .from('port_requests')
        .select('number')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (myError || !myRequests || myRequests.length === 0) {
        console.error('Could not find your number:', myError);
        setLoading(false);
        return;
      }

      const myNumber = myRequests[0].number;

      const { data, error } = await supabase
        .from('port_requests')
        .select('*')
        .eq('referrerPhone', myNumber);

      if (error) {
        console.error('Error fetching referrals:', error);
      } else {
        setReferrals(data);
      }

      setLoading(false);
    };

    fetchReferrals();
  }, [user]);

  return (
    <div className='mx-auto max-w-3xl p-6 font-mono'>
      <h1 className='mb-4 text-2xl font-bold'>📊 我的推荐 / My Referrals</h1>
      {loading ? (
        <p>加载中 / Loading...</p>
      ) : referrals.length === 0 ? (
        <p>暂无推荐记录 / No referrals yet.</p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full border border-gray-300'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='border px-4 py-2'>被推荐人 / Number</th>
                <th className='border px-4 py-2'>状态 / Plan Status</th>
                <th className='border px-4 py-2'>奖励状态 / Reward</th>
                <th className='border px-4 py-2'>时间 / Date</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((ref) => (
                <tr key={ref.id}>
                  <td className='border px-4 py-2'>{maskNumber(ref.number)}</td>
                  <td className='border px-4 py-2'>
                    {ref.plan_status || '待处理 / Pending'}
                  </td>
                  <td className='border px-4 py-2'>
                    {ref.reward_status || 'Pending'}
                  </td>
                  <td className='border px-4 py-2'>
                    {new Date(ref.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReferralTrackerPage;
