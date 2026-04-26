import db from "../../common/database/db.ts";
import type { Setting, UpdateSettingInput } from "./setting.type.ts";

export const settingRepository = {
  findSettingByUserId: async (userId: number): Promise<Setting | null> => {
    const sql = `
                    SELECT s.*
                    FROM settings s
                    INNER JOIN home_user hu ON hu.setting_id = s.id
                    WHERE hu.id = $1
                `;
    const values = [userId];
    const { rows } = await db.query<Setting>(sql, values);
    return rows[0] ?? null;
  },

  updateSettingById: async (
    data: Setting,
    settingId: number,
  ): Promise<Setting | null> => {
    const sql = `
                        UPDATE settings
                        SET
                        alert_threshold_days = $1,
                        push_notification_enabled = $2
                        WHERE id = $3
                        RETURNING *
  `;
    const values = [
      data.alert_threshold_days,
      data.push_notification_enabled,
      settingId,
    ];

    const { rows } = await db.query<Setting>(sql, values);
    return rows[0] ?? null;
  },

  insertSetting: async (data: Setting): Promise<Setting | null> => {
    const sql = `
                        INSERT INTO settings
                        (
                            alert_threshold_days,
                            push_notification_enabled
                        )
                        VALUES ($1, $2)
                        RETURNING *
        `;
    const values = [data.alert_threshold_days, data.push_notification_enabled];

    const { rows } = await db.query<Setting>(sql, values);
    return rows[0] ?? null;
  },

  updateSettingAtHome: async (
    settingId: number,
    authId: number,
  ): Promise<number | null> => {
    const sql = `
    UPDATE home_user 
    SET setting_id = $1
    WHERE id = $2
    RETURNING setting_id
  `;
    const values = [settingId, authId];
    const { rows } = await db.query<{ setting_id: number }>(sql, values);
    return rows[0]?.setting_id ?? null;
  },
};
