import {
  IconCat,
  IconAdjustmentsHorizontal,
  IconPawFilled,
  IconInfoCircle,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import SettingTab from './SettingTab';

export function SettingTabs() {

  const { t } = useTranslation();

  const tabs = [
    { icon: <IconCat size="1rem" />, color: 'blue', label: t('Add Pet') },
    { icon: <IconPawFilled size="1rem" />, color: 'teal', label: t('Edit Pet') },
    { icon: <IconAdjustmentsHorizontal size="1rem" />, color: 'violet', label: t('Settings') },
    { icon: <IconInfoCircle size="1rem" />, color: 'grape', label: t('About') },
  ];

  const sections = tabs.map((link, index) => <SettingTab {...link} key={link.label} index={index} />);

  return <div>{sections}</div>;
}