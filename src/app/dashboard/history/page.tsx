'use client';

import React from 'react';

const ManageBillingButton = () => {
  const handleBillingPortal = async () => {
    try {
      const res = await fetch('/api/create-billing-portal-session', {
        method: 'POST'
      });

      const data = await res.json();
      console.log('Billing portal response:', data);

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create billing portal session');
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('Something went wrong');
    }
  };

  return (
    <button
      onClick={handleBillingPortal}
      className='rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800'
    >
      💳 Manage Billing
    </button>
  );
};

export default ManageBillingButton;
