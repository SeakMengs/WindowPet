import {
  AppShell,
  Box,
  ActionIcon,
  ScrollArea,
  Stack,
  Flex,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconSun,
  IconMoonStars,
  IconCat,
  IconInfoCircle,
  IconSettings,
  IconBuildingStore,
  IconPaw,
} from '@tabler/icons-react';
import Logo from './ui/components/Logo';
import SettingTabs from './ui/shell/SettingTabs';
import { useTranslation } from 'react-i18next';
import { useSettingStore } from './hooks/useSettingStore';
import { handleSettingChange } from './utils/handleSettingChange';
import { ColorScheme, ColorSchemeType, ESettingTab, ISettingTabs } from './types/ISetting';
import { memo, useEffect, useMemo } from 'react';
import MyPets from './ui/setting_tabs/MyPets';
import PetShop from './ui/setting_tabs/PetShop';
import Settings from './ui/setting_tabs/Settings';
import { useSettingTabStore } from './hooks/useSettingTabStore';
import Title from './ui/components/Title';
import { Notifications } from '@mantine/notifications';
import About from './ui/setting_tabs/About';
import useQueryParams from './hooks/useQueryParams';
import { ModalsProvider } from '@mantine/modals';
import useInit from './hooks/useInit';
import { checkForUpdate } from './utils/update';
import { DispatchType } from './types/IEvents';
import AddPet from './ui/setting_tabs/AddPet';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

function SettingWindow() {
  const { theme: colorScheme, language, pets, defaultPet } = useSettingStore();
  const { t } = useTranslation();
  const queryParams = useQueryParams();
  const { activeTab, setActiveTab } = useSettingTabStore();
  const { setColorScheme } = useMantineColorScheme();

  // check for update when open settings window
  useInit(() => {
    checkForUpdate();
  });

  useEffect(() => {
    // set active tab from url search params, by doing this user can refresh the page and still get the same tab
    if (queryParams.has('tab') && Number(queryParams.get('tab')) !== activeTab) {
      setActiveTab(Number(queryParams.get('tab')));
    }
  }, [queryParams, activeTab]);
  
  const toggleColorScheme = (value?: ColorScheme) => {
    const newTheme = value || (colorScheme === ColorSchemeType.Dark ? ColorSchemeType.Light : ColorSchemeType.Dark);

    setColorScheme(newTheme);
    handleSettingChange(DispatchType.ChangeAppTheme, newTheme);
  }


  const settingTabs: ISettingTabs[] = useMemo(() => ([
    {
      Component: MyPets,
      title: t("My Pets", { totalPets: pets.length }),
      description: t("Meet your furry friend, a loyal companion who loves to play and cuddle"),
      Icon: <IconCat size="1rem" />,
      label: t('My Pet'),
      tab: ESettingTab.MyPets,
    },
    {
      Component: PetShop,
      title: t("Pet Shop Total", { totalPets: defaultPet.length }),
      description: t("Browse wide selection of adorable pets, find your perfect companion today!"),
      Icon: <IconBuildingStore size="1rem" />,
      label: t('Pet Shop'),
      tab: ESettingTab.PetShop,
    },
    {
      Component: AddPet,
      title: t("Add Custom Pet"),
      description: t("Add your custom pet to your computer and watch them bring kawaii cuteness to your digital world!"),
      Icon: <IconPaw size="1rem" />,
      label: t('Add Custom Pet'),
      tab: ESettingTab.AddPet,
    },
    {
      Component: Settings,
      title: t("Setting Preferences"),
      description: t("Choose what u desire, do what u love"),
      Icon: <IconSettings size="1rem" />,
      label: t('Settings'),
      tab: ESettingTab.Settings,
    },
    {
      Component: About,
      title: t("About"),
      description: t("Know more about WindowPet"),
      Icon: <IconInfoCircle size="1rem" />,
      label: t('About'),
      tab: ESettingTab.About,
    },
  ]), [language, pets.length]);
  let CurrentSettingTab = settingTabs[activeTab]?.Component;

  return (
    <>
      <Notifications position={'top-center'} limit={2} />
      <ModalsProvider>
        <AppShell
          padding={0}
          navbar={{ width: 80, breakpoint: 0 }}
        >
          <AppShell.Navbar p="md">
            <Flex style={{
              height: "100%"
            }} direction={"column"} justify={'space-between'} align={"center"}>
              <Stack justify="center" align={"center"}>
                <Logo />
                <AppShell.Section
                  mt={50}
                >
                  <Stack justify="center" align={"center"} gap={5}>
                    <SettingTabs activeTab={activeTab} settingTabs={settingTabs} />
                  </Stack>
                </AppShell.Section>
              </Stack>
              <AppShell.Section>
                <Stack justify="center" align={"center"}>
                  <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30} >
                    {colorScheme === ColorSchemeType.Dark ? <IconSun size="1rem" /> : <IconMoonStars size="1rem" />}
                  </ActionIcon>
                </Stack>
              </AppShell.Section>
            </Flex>
          </AppShell.Navbar>
          <AppShell.Main>
            <ScrollArea.Autosize h={"100vh"} key={activeTab}>
              <Box m={"lg"}>
                <Title title={settingTabs[activeTab].title} description={settingTabs[activeTab].description} />
                <CurrentSettingTab key={activeTab} />
              </Box>
            </ScrollArea.Autosize>
          </AppShell.Main>
        </AppShell>
      </ModalsProvider>
    </>
  );
}

export default memo(SettingWindow);