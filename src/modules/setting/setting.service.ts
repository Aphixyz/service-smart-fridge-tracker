import { appError } from "../../common/error/AppError.ts";
import { settingRepository } from "./setting.repository.ts";
import type { Setting, UpdateSettingInput } from "./setting.type.ts";

export const settingService = {
  async findSettingByUserId(userId: number): Promise<Setting | null> {
    const setting = await settingRepository.findSettingByUserId(userId);
    return setting;
  },
  async buildSetting(userId: number, data: Setting): Promise<Setting | null> {
    const findSettingHome = await settingRepository.findSettingByUserId(userId);
    if (!findSettingHome) {
      return null;
    }
    const payload: Setting = {
      ...findSettingHome,
      alert_threshold_days: data.alert_threshold_days,
      push_notification_enabled: data.push_notification_enabled,
    };
    const result = await settingRepository.updateSettingById(
      payload,
      findSettingHome.id,
    );
    return result;
  },
};
