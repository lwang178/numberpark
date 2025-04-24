'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PortabilityCheckPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulated check (you can replace this with actual API logic)
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Save to database
      const res = await fetch('/api/portability-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });

      if (!res.ok) throw new Error('Failed to save phone number');

      // Redirect to next step
      router.push('/dashboard/port-request');
    } catch (error) {
      console.error(error);
      alert('发生错误，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='flex min-h-screen items-center justify-center bg-white px-4'>
      <div className='w-full max-w-md rounded-xl border p-8 shadow-md'>
        <h1 className='mb-4 text-center text-2xl font-bold'>
          📞 号码可携性检查
        </h1>
        <p className='mb-6 text-center text-gray-600'>
          输入你想保留的美国手机号，我们将检测是否支持保号（当前测试阶段默认通过）。
        </p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='phone'
              className='block text-sm font-medium text-gray-700'
            >
              手机号
            </label>
            <input
              type='tel'
              id='phone'
              required
              pattern='[0-9]{10}'
              placeholder='例如：1234567890'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-400 focus:ring-yellow-400'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full rounded-md bg-yellow-400 py-2 font-medium text-black transition hover:bg-yellow-500'
          >
            {loading ? '检查中...' : '继续下一步'}
          </button>
        </form>
      </div>
    </main>
  );
}
