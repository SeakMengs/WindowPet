import SettingTab from './SettingTab';
import { memo, useCallback } from 'react';
import { ISettingTabsProps } from '../../types/components/type';
import { useSettingTabStore } from '../../hooks/useSettingTabStore';
import { useSearchParams } from 'react-router-dom';

function SettingTabs({ activeTab, settingTabs }: ISettingTabsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setActiveTab } = useSettingTabStore();

  const handleSetTab = useCallback((index: number) => {
    setActiveTab(index);

    // update url search params
    searchParams.set('tab', index.toString());
    setSearchParams(searchParams);
  }, [setActiveTab]);

  const sections = settingTabs.map((settingTab) => <SettingTab label={settingTab.label} Icon={settingTab.Icon} key={settingTab.label} active={settingTab.tab === activeTab} handleSetTab={() => handleSetTab(settingTab.tab)} />);

  return <>{sections}</>;
}

export default memo(SettingTabs);