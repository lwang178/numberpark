import { createPortRequest } from '@/lib/actions/createPortRequest';

export default function PortRequestForm() {
  return (
    <div className='mx-auto max-w-2xl p-6'>
      <h1 className='mb-4 text-2xl font-semibold'>📞 Port a Number</h1>

      <form action={createPortRequest} className='space-y-4'>
        <div className='flex gap-4'>
          <input
            name='firstName'
            placeholder='First Name'
            required
            className='input'
          />
          <input
            name='lastName'
            placeholder='Last Name'
            required
            className='input'
          />
        </div>

        <input
          name='address'
          placeholder='Street Address'
          required
          className='input w-full'
        />
        <input
          name='city'
          placeholder='City'
          required
          className='input w-full'
        />

        <div className='flex gap-4'>
          <select name='state' required className='input w-full'>
            <option value=''>State</option>
            {['NY', 'CA', 'TX', 'FL', 'IL', 'NJ', 'WA'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            name='zip'
            placeholder='Zip Code'
            required
            className='input w-full'
          />
        </div>

        <input
          name='accountNumber'
          placeholder='Account Number'
          required
          className='input w-full'
        />
        <input
          name='transferPin'
          placeholder='Transfer PIN'
          type='password'
          required
          className='input w-full'
        />

        <button type='submit' className='rounded bg-black px-4 py-2 text-white'>
          Submit Request
        </button>
      </form>
    </div>
  );
}
