'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className='flex h-screen flex-col items-center justify-center px-4 text-center'>
      <h1 className='mb-4 text-4xl font-bold'>Welcome to BananaPlan 🍌</h1>
      <p className='mb-6 max-w-xl text-lg text-gray-600'>
        A modern platform for managing porting requests with trust and speed.
      </p>
      <Link href='/sign-in' passHref>
        <button className='rounded-full bg-yellow-400 px-6 py-3 font-medium text-black transition hover:bg-yellow-500'>
          Get Started
        </button>
      </Link>
    </main>
  );
}
