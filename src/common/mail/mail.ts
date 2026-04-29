import nodemailer from "nodemailer";



export async function sentOtpEmail(email: string, otp: string) {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    })

    await transporter.sendMail({
        from: `"My App" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "OTP Verification",
        html: `
                <div style="background:#f5f5f5; padding:32px 16px; font-family:Arial, sans-serif;">
                <div style="max-width:520px; margin:0 auto; background:#ffffff; border-radius:20px; padding:32px; text-align:center; border:1px solid #eeeeee;">

                    <h2 style="margin:0; color:#111827; font-size:24px; font-weight:700;">
                    ยืนยันรหัส OTP
                    </h2>

                    <p style="margin:12px 0 0; color:#6b7280; font-size:15px; line-height:1.6;">
                    กรุณาใช้รหัสด้านล่างเพื่อยืนยันตัวตนของคุณ
                    </p>

                    <div style="margin:28px auto; padding:18px 24px; background:#fafafa; border:1px solid #e5e7eb; border-radius:16px; color:#111827; font-size:38px; font-weight:700; letter-spacing:10px;">
                    ${otp}
                    </div>

                    <p style="margin:0; color:#ef4444; font-size:14px;">
                    รหัสนี้หมดอายุภายใน 5 นาที
                    </p>

                </div>
                </div>  
            `,
    });

}