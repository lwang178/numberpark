'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className='flex min-h-screen flex-col'>
      {/* Hero Section */}
      <section className='flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-white px-6 py-24 text-center'>
        <h1 className='mb-4 text-5xl font-bold'>
          Porting Numbers Made Simple 🍌
        </h1>
        <p className='mb-8 max-w-2xl text-lg text-gray-600'>
          BananaPlan helps telecom providers track, manage, and approve number
          porting requests effortlessly — all in one place.
        </p>
        <a
          href='https://accounts.bananaplan.org/sign-in?redirect_url=https://www.bananaplan.org/dashboard'
          className='rounded-full bg-yellow-400 px-8 py-4 text-lg font-medium text-black transition hover:bg-yellow-500'
        >
          Get Started
        </a>
      </section>

      {/* How It Works */}
      <section className='bg-white py-20 text-center'>
        <h2 className='mb-12 text-3xl font-bold'>How It Works</h2>
        <div className='mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-3'>
          <div className='rounded-xl border p-6 shadow-sm'>
            <h3 className='mb-2 text-xl font-semibold'>📤 Submit</h3>
            <p className='text-gray-600'>
              Users enter porting details like name, address, account number,
              and PIN.
            </p>
          </div>
          <div className='rounded-xl border p-6 shadow-sm'>
            <h3 className='mb-2 text-xl font-semibold'>🔍 Review</h3>
            <p className='text-gray-600'>
              Admins review submissions in a unified dashboard with status
              control.
            </p>
          </div>
          <div className='rounded-xl border p-6 shadow-sm'>
            <h3 className='mb-2 text-xl font-semibold'>✅ Approve</h3>
            <p className='text-gray-600'>
              Approve requests, and users are instantly notified of status
              updates.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className='bg-gray-50 py-20 text-center'>
        <h2 className='mb-10 text-3xl font-bold'>Why BananaPlan?</h2>
        <ul className='mx-auto grid max-w-4xl grid-cols-1 gap-6 px-6 text-left md:grid-cols-2'>
          <li className='flex items-start gap-3'>
            <span className='text-lg text-green-600'>✔</span>
            <span className='text-gray-700'>
              Secure, Clerk-powered authentication
            </span>
          </li>
          <li className='flex items-start gap-3'>
            <span className='text-lg text-green-600'>✔</span>
            <span className='text-gray-700'>
              Live dashboard for real-time updates
            </span>
          </li>
          <li className='flex items-start gap-3'>
            <span className='text-lg text-green-600'>✔</span>
            <span className='text-gray-700'>
              Built on Supabase + Prisma + Next.js
            </span>
          </li>
          <li className='flex items-start gap-3'>
            <span className='text-lg text-green-600'>✔</span>
            <span className='text-gray-700'>
              Admin panel with inline status editing
            </span>
          </li>
        </ul>
      </section>

      {/* Call to Action */}
      <section className='bg-white py-20 text-center'>
        <h2 className='mb-6 text-3xl font-bold'>
          Ready to simplify your porting process?
        </h2>
        <a
          href='https://accounts.bananaplan.org/sign-in?redirect_url=https://www.bananaplan.org/dashboard'
          className='inline-block rounded-full bg-yellow-400 px-10 py-4 text-lg font-medium text-black transition hover:bg-yellow-500'
        >
          Start Now
        </a>
      </section>

      {/* Footer */}
      <footer className='py-10 text-center text-sm text-gray-400'>
        &copy; {new Date().getFullYear()} BananaPlan. All rights reserved.
      </footer>
    </main>
  );
}
