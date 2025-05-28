import resendemailtemplate from '../../email/resendemailtemplate';
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
export async function ResetEmailSender(email, verifyCode) {
    try {
        console.log("Sending email to:", email);
        const { data, error } = await resend.emails.send({
            from: 'Ecom Store <support@ecom-store.in>',
            to: email,
            subject: 'Welcome to our new ecommerce website',
            react: resendemailtemplate({ otp: verifyCode }),
        });
        if (error) {
            console.error('Email send error:', error);
            return { success: false, message: 'Failed to send verification email' };
        }
        console.log('Email sent successfully:', data);
        return { success: true, message: 'Verification email sent successfully' };
    }
    catch (emailError) {
        console.error('Error sending verification email', emailError);
        return { success: false, message: 'Failed to send verification email' };
    }
}
