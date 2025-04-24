'use client';

import React, { useState } from 'react';
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
    esimimei: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('请先登录 / Please log in first');
      return;
    }

    const { error } = await supabase.from('port_requests').insert([
      {
        type,
        ...form,
        user_id: user.id
      }
    ]);

    if (error) {
      console.error('Submission error:', error);
      alert('提交失败，请稍后再试');
      return;
    }

    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: 'price_1RH9pPInEkfFxa3EXD2y65C2' }) // replace with your actual Stripe Price ID
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(
        'Stripe checkout session creation failed:',
        res.status,
        text
      );
      alert('创建结账会话失败，请联系支持 / Failed to create checkout session');
      return;
    }

    const { url } = await res.json();
    if (url) {
      window.location.href = url;
    } else {
      alert('跳转结账失败 / Failed to redirect to checkout');
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
              htmlFor='plan_carrier'
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
              <option value='Verizon'>Verizon</option>
              <option value='T-Mobile'>T-Mobile</option>
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

          <div>
            <label
              htmlFor='firstname'
              className='block text-sm font-medium text-gray-700'
            >
              名 / First Name
            </label>
            <input
              id='firstname'
              name='firstname'
              value={form.firstname}
              onChange={handleChange}
              className='mt-1 w-full rounded-md border border-gray-300 p-2'
              required
            />
          </div>
          <div>
            <label
              htmlFor='lastname'
              className='block text-sm font-medium text-gray-700'
            >
              姓 / Last Name
            </label>
            <input
              id='lastname'
              name='lastname'
              value={form.lastname}
              onChange={handleChange}
              className='mt-1 w-full rounded-md border border-gray-300 p-2'
              required
            />
          </div>

          {type === 'port' && (
            <>
              <div>
                <label
                  htmlFor='number'
                  className='block text-sm font-medium text-gray-700'
                >
                  要转入的号码 / Phone Number
                </label>
                <input
                  id='number'
                  name='number'
                  value={form.number}
                  onChange={handleChange}
                  className='mt-1 w-full rounded-md border border-gray-300 p-2'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='carrier'
                  className='block text-sm font-medium text-gray-700'
                >
                  原运营商 / Current Carrier
                </label>
                <select
                  id='carrier'
                  name='carrier'
                  value={form.carrier}
                  onChange={handleChange}
                  className='mt-1 w-full rounded-md border border-gray-300 p-2'
                  required
                >
                  <option value=''>请选择</option>
                  <option value='Verizon'>Verizon</option>
                  <option value='AT&T'>AT&T</option>
                  <option value='T-Mobile'>T-Mobile</option>
                  <option value='Other'>Other</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor='accountnumber'
                  className='block text-sm font-medium text-gray-700'
                >
                  转网账号 / Account Number
                </label>
                <input
                  id='accountnumber'
                  name='accountnumber'
                  value={form.accountnumber}
                  onChange={handleChange}
                  className='mt-1 w-full rounded-md border border-gray-300 p-2'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='transferpin'
                  className='block text-sm font-medium text-gray-700'
                >
                  转网 PIN / Transfer PIN
                </label>
                <input
                  id='transferpin'
                  name='transferpin'
                  value={form.transferpin}
                  onChange={handleChange}
                  className='mt-1 w-full rounded-md border border-gray-300 p-2'
                  required
                />
              </div>
            </>
          )}

          <div>
            <label
              htmlFor='simtype'
              className='block text-sm font-medium text-gray-700'
            >
              SIM 类型 / SIM Type
            </label>
            <select
              id='simtype'
              name='simtype'
              value={form.simtype}
              onChange={handleChange}
              className='mt-1 w-full rounded-md border border-gray-300 p-2'
              required
            >
              <option value=''>请选择</option>
              <option value='eSIM'>eSIM</option>
              <option value='Physical'>实体 SIM</option>
            </select>
          </div>

          {form.simtype === 'Physical' && (
            <>
              <div>
                <label
                  htmlFor='addressline1'
                  className='block text-sm font-medium text-gray-700'
                >
                  地址行1 / Address Line 1
                </label>
                <input
                  id='addressline1'
                  name='addressline1'
                  value={form.addressline1}
                  onChange={handleChange}
                  className='mt-1 w-full rounded-md border border-gray-300 p-2'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='addressline2'
                  className='block text-sm font-medium text-gray-700'
                >
                  地址行2 / Address Line 2
                </label>
                <input
                  id='addressline2'
                  name='addressline2'
                  value={form.addressline2}
                  onChange={handleChange}
                  className='mt-1 w-full rounded-md border border-gray-300 p-2'
                />
              </div>
              <div>
                <label
                  htmlFor='city'
                  className='block text-sm font-medium text-gray-700'
                >
                  城市 / City
                </label>
                <input
                  id='city'
                  name='city'
                  value={form.city}
                  onChange={handleChange}
                  className='mt-1 w-full rounded-md border border-gray-300 p-2'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='state'
                  className='block text-sm font-medium text-gray-700'
                >
                  州 / State
                </label>
                <input
                  id='state'
                  name='state'
                  value={form.state}
                  onChange={handleChange}
                  className='mt-1 w-full rounded-md border border-gray-300 p-2'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='zip'
                  className='block text-sm font-medium text-gray-700'
                >
                  邮编 / ZIP Code
                </label>
                <input
                  id='zip'
                  name='zip'
                  value={form.zip}
                  onChange={handleChange}
                  className='mt-1 w-full rounded-md border border-gray-300 p-2'
                  required
                />
              </div>
            </>
          )}

          {form.simtype === 'eSIM' && (
            <div>
              <label
                htmlFor='esimimei'
                className='block text-sm font-medium text-gray-700'
              >
                eSIM IMEI
              </label>
              <input
                id='esimimei'
                name='esimimei'
                value={form.esimimei}
                onChange={handleChange}
                className='mt-1 w-full rounded-md border border-gray-300 p-2'
                required
              />
            </div>
          )}

          <button
            type='submit'
            className='mt-4 rounded-lg bg-black px-6 py-2 text-white transition hover:bg-gray-800'
          >
            ✅ 提交信息 / Submit Info
          </button>
        </form>
      </div>
    </div>
  );
};

export default PortRequestPage;
