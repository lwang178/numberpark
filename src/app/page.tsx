'use client';

export default function HomePage() {
  return (
    <main className='bg-white'>
      {/* Hero Section */}
      <section className='flex h-screen flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-white px-6 py-24 text-center'>
        <h1 className='mb-4 text-5xl font-bold'>
          回国也能保号，不再每月白花钱 🍌
        </h1>
        <p className='mb-8 max-w-2xl text-lg text-gray-600'>
          香蕉计划专为回国留学生设计，让你在暑假不使用手机的期间轻松停机保号。
          <br />
          验证码短信可自动转发到邮箱，方便登录银行、App、PayPal 等账户。
          <br />
          回美后也可一键转回原运营商，手机号无缝恢复使用。
        </p>
        <a
          href='https://accounts.bananaplan.org/sign-in?redirect_url=https://www.bananaplan.org/dashboard'
          className='rounded-full bg-yellow-400 px-8 py-4 text-lg font-medium text-black transition hover:bg-yellow-500'
        >
          立即保号
        </a>
      </section>

      {/* How It Works */}
      <section className='bg-white py-20 text-center'>
        <h2 className='mb-12 text-3xl font-bold'>如何使用</h2>
        <div className='mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-3'>
          <div className='rounded-xl border p-6 shadow-sm'>
            <h3 className='mb-2 text-xl font-semibold'>📤 填写信息</h3>
            <p className='text-gray-600'>
              输入姓名、地址、账号和转网PIN码等基础信息。
            </p>
          </div>
          <div className='rounded-xl border p-6 shadow-sm'>
            <h3 className='mb-2 text-xl font-semibold'>🔍 审核处理</h3>
            <p className='text-gray-600'>
              管理员在后台处理你的申请，确保信息准确无误。
            </p>
          </div>
          <div className='rounded-xl border p-6 shadow-sm'>
            <h3 className='mb-2 text-xl font-semibold'>✅ 成功保号</h3>
            <p className='text-gray-600'>
              审核通过后，你的手机号将安全保留，回国也安心。
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className='bg-gray-50 py-20 text-center'>
        <h2 className='mb-10 text-3xl font-bold'>为什么选择 BananaPlan？</h2>
        <ul className='mx-auto grid max-w-4xl grid-cols-1 gap-6 px-6 text-left md:grid-cols-2'>
          <li className='flex items-start gap-3'>
            <span className='text-lg text-green-600'>✔</span>
            <span className='text-gray-700'>
              每月节省 $40–60 美元，无需为没用的手机套餐付费
            </span>
          </li>
          <li className='flex items-start gap-3'>
            <span className='text-lg text-green-600'>✔</span>
            <span className='text-gray-700'>
              验证码短信自动转发至邮箱，安心登录银行/支付账户
            </span>
          </li>
          <li className='flex items-start gap-3'>
            <span className='text-lg text-green-600'>✔</span>
            <span className='text-gray-700'>
              回美国后轻松转回原运营商，原手机号无缝恢复
            </span>
          </li>
          <li className='flex items-start gap-3'>
            <span className='text-lg text-green-600'>✔</span>
            <span className='text-gray-700'>
              全流程线上完成，5分钟搞定，无需电话联系客服
            </span>
          </li>
        </ul>
      </section>

      {/* Call to Action */}
      <section className='bg-white py-20 text-center'>
        <h2 className='mb-6 text-3xl font-bold'>
          想省钱又不想失联？现在就开始保号
        </h2>
        <a
          href='https://accounts.bananaplan.org/sign-in?redirect_url=https://www.bananaplan.org/dashboard'
          className='inline-block rounded-full bg-yellow-400 px-10 py-4 text-lg font-medium text-black transition hover:bg-yellow-500'
        >
          开始保号
        </a>
      </section>

      {/* Footer */}
      <footer className='py-10 text-center text-sm text-gray-400'>
        &copy; {new Date().getFullYear()} BananaPlan 版权所有
      </footer>
    </main>
  );
}
