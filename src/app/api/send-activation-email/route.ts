import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  // 🔍 Get user's email from Supabase
  const { data, error } = await supabase
    .from('port_requests')
    .select('email')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data?.email) {
    console.error('❌ Failed to find email:', error);
    return NextResponse.json({ error: 'Email not found' }, { status: 404 });
  }

  const toEmail = data.email;

  // ✉️ Styled HTML content
  const html = `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      <div style="background-color: #111827; color: #ffffff; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">欢迎加入 Telco Club</h1>
      </div>
      <div style="padding: 32px; font-size: 16px; color: #111827; line-height: 1.6;">
        <p>亲爱的会员，您好！</p>
        <p>您的手机号码已成功激活。现在，您已正式成为 Telco Club 的一员，享受专属的俱乐部通信服务 🎉</p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

        <h2 style="font-size: 18px; margin-bottom: 12px;">💰 推荐好友，持续享折扣</h2>
        <p>使用您的专属邀请码（即您的手机号）邀请好友加入：</p>
        <ul>
          <li>每成功推荐一人，您和好友 <strong>每月各可享 $5 折扣</strong></li>
          <li>好友在有效套餐上保持活跃，您就能持续获取奖励</li>
          <li>推荐越多，优惠叠加，无上限</li>
        </ul>
        <p>📌 邀请方式简单：让好友在注册时填写您的手机号即可。</p>
        <p>您可以登录俱乐部后台 <a href="https://app.telcoclub.org/dashboard/referral" style="color: #3b82f6; text-decoration: none;">查看推荐情况</a>。</p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

        <h2 style="font-size: 18px; margin-bottom: 12px;">📞 客服支持渠道</h2>
        <p>如有任何问题，欢迎通过以下方式联系我们：</p>
        <ul>
          <li>☎️ 微信小助手：<strong>Telco_Club</strong></li>
          <li>📱 短信客服：<strong>+1 (347) 406-4185</strong></li>
          <li>📧 客服邮箱：<a href="mailto:support@telcoclub.org" style="color: #3b82f6;">support@telcoclub.org</a></li>
        </ul>

        <p style="margin-top: 32px;">再次欢迎您的加入，祝您在 Telco Club 的体验愉快！</p>
        <p style="color: #6b7280;">— Telco Club 团队</p>
      </div>
    </div>
  </div>
  `;

  // ✅ Send email via Resend
  const send = await resend.emails.send({
    from: 'Telco Club <team@telcoclub.org>', // change to your domain after verifying
    to: [toEmail],
    subject: '📱 您的号码已激活 / Your Number is Now Active',
    html
  });

  if (send.error) {
    console.error('❌ Failed to send email:', send.error);
    return NextResponse.json({ error: 'Email send failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
