'use client';

type Props = {
  id: string;
  status: string;
};

export default function StatusSelect({ id, status }: Props) {
  return (
    <form action='/admin/update-status' method='POST'>
      <input type='hidden' name='id' value={id} />
      <select
        name='status'
        defaultValue={status}
        onChange={(e) => e.currentTarget.form?.submit()}
        className='rounded-md border px-2 py-1 text-sm'
      >
        <option value='pending'>待审核</option>
        <option value='processing'>处理中</option>
        <option value='approved'>已通过</option>
        <option value='rejected'>已拒绝</option>
      </select>
    </form>
  );
}
