import { appError } from "../../common/error/AppError.ts";
import { settingRepository } from "./setting.repository.ts";
import type { Setting } from "./setting.type.ts";

export const settingService = {
  async findSettingByUserId(userId: number): Promise<any | null> {
    const setting = await settingRepository.findSettingByUserId(userId);
    if (!setting) {
      return appError.notFound("setting not found!");
    }
    return setting;
  },

  async buildSetting(userId: number, data: Setting): Promise<Setting | null> {
    const findSettingHome = await settingRepository.findSettingByUserId(userId);
    if (!findSettingHome) {
      return this.buildSettingAtHome(data, userId);
    }
    const payload: Setting = {
      ...findSettingHome,
      alert_threshold_days: data.alert_threshold_days,
      push_notification_enabled: data.push_notification_enabled,
    };
    return await settingRepository.updateSettingById(
      payload,
      findSettingHome.id,
    );
  },

  async buildSettingAtHome(data: Setting, userId: number): Promise<any | null> {
    const payload: Setting = {
      ...data,
      user_id: userId,
    };
    const result = await settingRepository.insertSetting(payload);
    if (!result?.id) {
      return appError.notFound("inserted but id setting not return!");
    }
    await settingRepository.updateSettingAtHome(result.id, userId);
    return result;
  },
};
