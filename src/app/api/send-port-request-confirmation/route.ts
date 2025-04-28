import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY); // you can also use SendGrid or others

export async function POST(req: Request) {
  const { email, firstname, plan } = await req.json();

  try {
    const data = await resend.emails.send({
      from: 'support@telcoclub.org',
      to: [email],
      subject: 'Port Request Received ✔️',
      html: `
        <h1>Hi ${firstname},</h1>
        <p>We've received your port request for the ${plan} plan.</p>
        <p>We will notify you once the porting is completed!</p>
        <br/>
        <p>Thank you for choosing Telco Club 🏄‍♂️</p>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
