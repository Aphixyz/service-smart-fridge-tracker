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
        html:   `
                        <h2>รหัส OTP ของคุณ</h2>
                        <h1>${otp}</h1>
                        <p>รหัสนี้หมดอายุภายใน 5 นาที</p>
                `,
    })

}