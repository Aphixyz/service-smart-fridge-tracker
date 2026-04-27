import db from "../../common/database/db";

export const otpRepository = {
    async create(data: {
        email: string;
        otp_hash: string;
        purpose: string;
        expires_at: Date;
    }) {
        const sql = `
      INSERT INTO email_otps
      (email, otp_hash, purpose, expires_at)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

        const { rows } = await db.query(sql, [
            data.email,
            data.otp_hash,
            data.purpose,
            data.expires_at,
        ]);

        return rows[0];
    },

    async findLatest(email: string, purpose: string) {
        const sql = `
      SELECT *
      FROM email_otps
      WHERE email = $1
        AND purpose = $2
      ORDER BY created_at DESC
      LIMIT 1
    `;

        const { rows } = await db.query(sql, [email, purpose]);
        return rows[0] ?? null;
    },

    async increaseAttempts(id: number) {
        await db.query(
            `
      UPDATE email_otps
      SET attempts = attempts + 1
      WHERE id = $1
      `,
            [id]
        );
    },

    async markVerified(id: number) {
        await db.query(
            `
      UPDATE email_otps
      SET verified_at = CURRENT_TIMESTAMP
      WHERE id = $1
      `,
            [id]
        );
    },
};