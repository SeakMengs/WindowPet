import {
  IconCat,
  IconAdjustmentsHorizontal,
  IconPawFilled,
  IconInfoCircle,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import SettingTab from './SettingTab';
import { useSettingTabStore } from '../../hooks/useSettingTabStore';
import { memo, useMemo } from 'react';

function SettingTabs() {
  const { setPage } = useSettingTabStore();
  const { t } = useTranslation();

  const tabs = useMemo(() => {
    return [
      { icon: <IconCat size="1rem" />, color: 'blue', label: t('Add Pet') },
      { icon: <IconPawFilled size="1rem" />, color: 'teal', label: t('Edit Pet') },
      { icon: <IconAdjustmentsHorizontal size="1rem" />, color: 'violet', label: t('Settings') },
      { icon: <IconInfoCircle size="1rem" />, color: 'grape', label: t('About') },
    ]
  }, [t]);

  const sections = tabs.map((link, index) => <SettingTab {...link} key={link.label} index={index} handleSetTab={setPage} />);

  return <div>{sections}</div>;
}

export default memo(SettingTabs);