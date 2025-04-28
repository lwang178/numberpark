import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>Telco Club申请确认</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background: white; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px;">
      <tr>
        <td style="text-align: center;">
          <h1 style="color: #111827;">✅ Telco Club套餐申请已收到</h1>
          <p style="font-size: 16px; color: #4b5563;">感谢您提交Telco Club套餐申请！</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px 0;">
          <p style="font-size: 15px; color: #374151; line-height: 1.6;">
            我们已成功接收到您的信息，我们的客服人员将在24小时内审核您的申请。
            <br /><br />
            审核完成后，我们将通过邮件或短信通知您进一步的步骤。
            <br /><br />
            如有任何疑问，欢迎随时联系我们：
          </p>
          <ul style="font-size: 15px; color: #374151; line-height: 1.6; margin-left: 20px; padding-left: 0;">
            <li>📧 邮箱: support@telcoclub.org</li>
            <li>📲 微信客服: Telco_Club</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td style="text-align: center; padding-top: 20px;">
          <p style="font-size: 14px; color: #9ca3af;">感谢选择 Telco Club</p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  }

  try {
    const data = await resend.emails.send({
      from: 'Telco Club <support@telcoclub.org>',
      to: [email],
      subject: '✅ Telco Club套餐申请已收到',
      html: htmlContent
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
