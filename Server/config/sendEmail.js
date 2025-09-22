import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();
if (!process.env.RESEND_API) {
    throw new Error('RESEND_API is not defined in environment variables');
}
const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'BinkeyIt <onboarding@resend.dev>',
            to: sendTo,
            subject: subject,
            html: html,
        });
        if (error) {
            return console.error({ error });
        }
        return data;
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
}

export default sendEmail;