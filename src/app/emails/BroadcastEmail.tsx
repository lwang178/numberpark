'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const TelcoLandingPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/account');
  }, [router]);

  return null;
};

export default TelcoLandingPage;
