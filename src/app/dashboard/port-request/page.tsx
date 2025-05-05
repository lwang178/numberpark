'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@clerk/nextjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PortRequestPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState('port');
  const [form, setForm] = useState({
    plan: '',
    firstname: '',
    lastname: '',
    number: '',
    carrier: '',
    accountnumber: '',
    transferpin: '',
    simtype: '',
    addressline1: '',
    addressline2: '',
    city: '',
    state: '',
    zip: '',
    esimimei: '',
    referrerPhone: ''
  });

  useEffect(() => {
    const checkIfUserHasNumber = async () => {
      if (!user || !user.id) return;

      const { data, error } = await supabase
        .from('port_requests')
        .select('number')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error checking for existing number:', error);
        return;
      }

      const latest = data?.[0];
      if (latest?.number && latest.number.trim() !== '') {
        router.push('/dashboard/account');
      }
    };

    checkIfUserHasNumber();
  }, [user, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'referrerPhone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setForm((prev) => ({ ...prev, [name]: digitsOnly }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting) return;
    setSubmitting(true);

    try {
      if (!user) {
        alert('请先登录 / Please log in first');
        return;
      }

      if (form.referrerPhone && !/^\d{10}$/.test(form.referrerPhone)) {
        alert(
          '推荐人手机号必须是10位数字 / Referrer phone must be exactly 10 digits'
        );
        return;
      }

      const { error } = await supabase.from('port_requests').insert([
        {
          ...form,
          user_id: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? '',
          type,
          number: type === 'new' ? 'To Be Assigned' : form.number
        }
      ]);

      if (error) {
        console.error('Submission error:', error);
        alert('提交失败，请稍后再试');
        return;
      }

      await fetch('/api/send-port-request-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.primaryEmailAddress?.emailAddress,
          firstname: form.firstname,
          plan: form.plan
        })
      });

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: 'price_1MPHx6InEkfFxa3E8JNeVXdm' })
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(
          'Stripe checkout session creation failed:',
          res.status,
          text
        );
        alert(
          '创建结账会话失败，请联系支持 / Failed to create checkout session'
        );
        return;
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        alert('跳转结账失败 / Failed to redirect to checkout');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='mx-auto min-h-screen max-w-3xl space-y-8 bg-gradient-to-b from-gray-50 to-gray-100 p-8 font-mono'>
      <h1 className='border-b pb-4 text-3xl font-extrabold text-gray-900'>
        📤 提交号码信息 / Submit Number Info
      </h1>

      <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-md'>
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label
              htmlFor='plan'
              className='block text-sm font-medium text-gray-700'
            >
              选择俱乐部套餐 / Choose Plan
            </label>
            <select
              id='plan'
              name='plan'
              value={form.plan}
              onChange={handleChange}
              className='mt-1 w-full rounded-md border border-gray-300 p-2'
              required
            >
              <option value=''>请选择</option>
              <option value='T-Mobile'>T-Mobile</option>
              <option value='Verizon' disabled>
                Verizon（暂时已满）
              </option>
              <option value='AT&T' disabled>
                AT&T（暂时已满）
              </option>
            </select>
          </div>

          <div className='mb-4'>
            <label className='mr-6 font-semibold'>
              <input
                type='radio'
                name='type'
                value='port'
                checked={type === 'port'}
                onChange={() => setType('port')}
                className='mr-2'
              />{' '}
              携号转网 / Port Existing Number
            </label>
            <label className='font-semibold'>
              <input
                type='radio'
                name='type'
                value='new'
                checked={type === 'new'}
                onChange={() => setType('new')}
                className='mr-2'
              />{' '}
              申请新号码 / Request New Number
            </label>
          </div>

          <input
            required
            id='firstname'
            name='firstname'
            value={form.firstname}
            onChange={handleChange}
            placeholder='名 / First Name'
            className='w-full rounded-md border border-gray-300 p-2'
          />
          <input
            required
            id='lastname'
            name='lastname'
            value={form.lastname}
            onChange={handleChange}
            placeholder='姓 / Last Name'
            className='w-full rounded-md border border-gray-300 p-2'
          />

          {type === 'port' && (
            <>
              <input
                required
                id='number'
                name='number'
                value={form.number}
                onChange={handleChange}
                placeholder='要转入的号码 / Phone Number'
                className='w-full rounded-md border border-gray-300 p-2'
              />
              <select
                required
                id='carrier'
                name='carrier'
                value={form.carrier}
                onChange={handleChange}
                className='w-full rounded-md border border-gray-300 p-2'
              >
                <option value=''>原运营商 / Current Carrier</option>
                <option value='Verizon'>Verizon</option>
                <option value='AT&T'>AT&T</option>
                <option value='T-Mobile'>T-Mobile</option>
                <option value='Other'>Other</option>
              </select>
              <input
                required
                id='accountnumber'
                name='accountnumber'
                value={form.accountnumber}
                onChange={handleChange}
                placeholder='转网账号 / Account Number'
                className='w-full rounded-md border border-gray-300 p-2'
              />
              <input
                required
                id='transferpin'
                name='transferpin'
                value={form.transferpin}
                onChange={handleChange}
                placeholder='转网 PIN / Transfer PIN'
                className='w-full rounded-md border border-gray-300 p-2'
              />
            </>
          )}

          <select
            required
            id='simtype'
            name='simtype'
            value={form.simtype}
            onChange={handleChange}
            className='w-full rounded-md border border-gray-300 p-2'
          >
            <option value=''>SIM 类型 / SIM Type</option>
            <option value='eSIM'>eSIM</option>
            <option value='Physical'>实体 SIM</option>
          </select>

          {form.simtype === 'Physical' && (
            <>
              <input
                required
                id='addressline1'
                name='addressline1'
                value={form.addressline1}
                onChange={handleChange}
                placeholder='地址行1 / Address Line 1'
                className='w-full rounded-md border border-gray-300 p-2'
              />
              <input
                id='addressline2'
                name='addressline2'
                value={form.addressline2}
                onChange={handleChange}
                placeholder='地址行2 / Address Line 2'
                className='w-full rounded-md border border-gray-300 p-2'
              />
              <input
                required
                id='city'
                name='city'
                value={form.city}
                onChange={handleChange}
                placeholder='城市 / City'
                className='w-full rounded-md border border-gray-300 p-2'
              />
              <input
                required
                id='state'
                name='state'
                value={form.state}
                onChange={handleChange}
                placeholder='州 / State'
                className='w-full rounded-md border border-gray-300 p-2'
              />
            </>
          )}

          {form.simtype === 'eSIM' && (
            <input
              required
              id='esimimei'
              name='esimimei'
              value={form.esimimei}
              onChange={handleChange}
              placeholder='eSIM IMEI'
              className='w-full rounded-md border border-gray-300 p-2'
            />
          )}

          {form.simtype && (
            <input
              required
              id='zip'
              name='zip'
              value={form.zip}
              onChange={handleChange}
              placeholder='邮编 / ZIP Code'
              className='w-full rounded-md border border-gray-300 p-2'
            />
          )}

          <input
            id='referrerPhone'
            name='referrerPhone'
            type='tel'
            inputMode='numeric'
            pattern='[0-9]*'
            placeholder='推荐人手机号 或 推荐码 / Referrer Phone or Code (Optional)'
            value={form.referrerPhone}
            onChange={handleChange}
            className='w-full rounded-md border border-gray-300 p-2'
            maxLength={10}
          />

          <button
            type='submit'
            disabled={submitting}
            className={`mt-4 w-full rounded-lg px-6 py-2 text-white transition ${
              submitting
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-black hover:bg-gray-800'
            }`}
          >
            {submitting ? '提交中… / Submitting…' : '✅ 提交信息 / Submit Info'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PortRequestPage;
