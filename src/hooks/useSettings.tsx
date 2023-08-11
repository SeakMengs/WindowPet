import { useEffect, useState } from "react";
import { getAppSettings } from "../utils/settingsFunction";

export interface ISetting {
    language: string,
    theme: 'light' | 'dark',
}

export default function useSetting() {
    const [appSetting, setAppSetting] = useState<any>();

    useEffect(() => {
        (async function () {
            const setting = await getAppSettings();
            setAppSetting(setting);
        })();
    }, []);

    return appSetting as ISetting;
}