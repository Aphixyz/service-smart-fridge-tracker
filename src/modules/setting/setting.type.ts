export interface Setting {
    id: number;
    alert_threshold_days: number;
    push_notification_enabled: boolean;
    [key: string]: any;
}

export interface CreateSettingInput {
    alert_threshold_days: number;
    push_notification_enabled: boolean;
}

export interface UpdateSettingInput {
    alert_threshold_days?: number;
    push_notification_enabled?: boolean;
}

export interface BuildSettingHomeInput {
    settingId: number;
    homeId: number;
}

