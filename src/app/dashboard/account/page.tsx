'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@clerk/nextjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const DashboardOverview = () => {
  const router = useRouter();
  const { user } = useUser();
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!user) return;

      let { data, error } = await supabase
        .from('port_requests')
        .select(
          'number, plan, plan_status, plan_price, plan_next_bill, sim_info, plan_port_status, simtype'
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // If not found by user_id, try by email
      if (!data) {
        const email = user.primaryEmailAddress?.emailAddress.toLowerCase();
        const fallback = await supabase
          .from('port_requests')
          .select(
            'number, plan, plan_status, plan_price, plan_next_bill, sim_info, plan_port_status, simtype'
          )
          .eq('email', email)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        data = fallback.data;
        error = fallback.error;
      }

      console.log('Fetched plan:', data, 'Error', error);

      if (error) {
        console.error('Error fetching port request:', error);
        return;
      }

      if (!data || !data?.number?.trim()) {
        router.replace('/dashboard/port-request');
      } else {
        setPlan(data);
      }
    };

    fetchPlan();
  }, [router, user]);

  const goToBillingPortal = async () => {
    try {
      const res = await fetch('/api/create-billing-portal-session', {
        method: 'POST'
      });
      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        alert('Failed to open billing portal');
      }
    } catch (err) {
      console.error('Billing portal error:', err);
      alert('Something went wrong');
    }
  };

  return (
    <div className='mx-auto min-h-screen max-w-4xl space-y-10 bg-gradient-to-b from-gray-50 to-gray-100 p-8 font-mono'>
      <h1 className='border-b pb-4 text-4xl font-extrabold text-gray-900'>
        📱 套餐总览 / Your Mobile Plan
      </h1>

      <section className='rounded-2xl border border-gray-200 bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-xl font-bold text-gray-800'>
          📦 套餐信息 / Plan Details
        </h2>
        <div className='grid grid-cols-2 gap-y-3 text-gray-700'>
          <p>运营商 / Carrier:</p>
          <p className='font-semibold'>{plan?.plan || '—'}</p>
          <p>状态 / Status:</p>
          <p className='font-semibold text-green-600'>
            {plan?.plan_status || 'Pending'}
          </p>
          <p>月费 / Monthly Price:</p>
          <p>${plan?.plan_price ?? '—'}</p>
          {/*
          <p>下次扣费 / Next Bill:</p>
          <p>{plan?.plan_next_bill || '—'}</p>
         */}

          <p>SIM 信息 / SIM Info:</p>
          <p>{plan?.simtype || '—'}</p>
        </div>
      </section>

      <section className='rounded-2xl border border-gray-200 bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-xl font-bold text-gray-800'>
          🔄 携号转网状态 / Porting Status
        </h2>
        <div className='grid grid-cols-2 gap-y-3 text-gray-700'>
          <p>号码 / Number:</p>
          <p>{plan?.number || '暂无号码 / No number yet'}</p>
          <p>状态 / Status:</p>
          <p className='font-semibold text-yellow-600'>
            {plan?.plan_port_status || '等待运营商处理 / Waiting for carrier'}
          </p>
        </div>
      </section>

      {/*
      <section className='rounded-2xl border border-gray-200 bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-xl font-bold text-gray-800'>
          💳 账单与付款 / Billing & Payment
        </h2>
        <div className='grid grid-cols-2 gap-y-3 text-gray-700'>
          <p>最近支付 / Last Payment:</p>
          <p>$35 on 2025年4月5日</p>
          <p>付款方式 / Payment Method:</p>
          <p>Visa 尾号 ****4242</p>
        </div>
        <button className='mt-4 rounded-lg bg-black px-5 py-2 text-white transition hover:bg-gray-800'>
          📄 下载发票 / Download Invoice
        </button>
      </section>
      
   */}

      {/*
      <section className='rounded-2xl border border-gray-200 bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-xl font-bold text-gray-800'>
          🛠 操作中心 / Action Center
        </h2>
        <div className='divide-y'>
          {[
            '更新携号信息 / Update Port Info',
            '申请补发SIM / Request Replacement SIM',
            '暂停服务 / Pause Service',
            '取消服务 / Cancel Service'
          ].map((action, i) => (
            <button
              key={i}
              className='block w-full px-2 py-3 text-left text-gray-800 hover:bg-gray-100'
            >
              {action}
            </button>
          ))}
        </div>
      </section>


*/}

      <section className='rounded-2xl border border-gray-200 bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-xl font-bold text-gray-800'>
          💳 账单与付款 / Billing & Payment
        </h2>
        <div className='divide-y'>
          {[
            '修改支付方式 / Update Payment Method',
            '查看账单 / Check Invoices'
          ].map((action, i) => (
            <button
              key={i}
              onClick={goToBillingPortal}
              className='block w-full cursor-pointer px-2 py-3 text-left text-gray-800 transition hover:bg-gray-100 active:bg-gray-200'
            >
              {action}
            </button>
          ))}
        </div>
      </section>

      <section className='rounded-2xl border border-gray-200 bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-xl font-bold text-gray-800'>
          💬 客服支持 / Support
        </h2>
        <p className='text-gray-700'>
          邮箱 / Email:{' '}
          <a
            href='mailto:support@telcoclub.org'
            className='text-blue-600 hover:underline'
          >
            support@telcoclub.org
          </a>
        </p>
        <p className='text-gray-700'>
          微信客服: <span className='font-medium'>Telco_Club</span>
        </p>
        <div className='mt-4 flex flex-wrap gap-4'>
          <button className='rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
            📧 发邮件
          </button>
          <button className='rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700'>
            📲 加微信客服
          </button>
        </div>
      </section>
    </div>
  );
};

export default DashboardOverview;
