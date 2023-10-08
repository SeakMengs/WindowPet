import {
  AppShell,
  Navbar,
  Box,
  ActionIcon,
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
  ScrollArea,
  Stack,
  Flex,
} from '@mantine/core';
import {
  IconSun,
  IconMoonStars,
  IconCat,
  IconInfoCircle,
  IconSettings,
  IconBuildingStore,
} from '@tabler/icons-react';
import Logo from './ui/components/Logo';
import SettingTabs from './ui/shell/SettingTabs';
import { useTranslation } from 'react-i18next';
import { useSettingStore } from './hooks/useSettingStore';
import { handleSettingChange } from './utils/handleSettingChange';
import { ESettingTab, ISettingTabs } from './types/ISetting';
import { memo, useMemo, useRef } from 'react';
import MyPets from './ui/setting_tabs/MyPets';
import PetShop from './ui/setting_tabs/PetShop';
import Settings from './ui/setting_tabs/Settings';
import { useSettingTabStore } from './hooks/useSettingTabStore';
import Title from './ui/components/Title';
import { PrimaryColor } from './utils';
import { Notifications } from '@mantine/notifications';
import About from './ui/setting_tabs/About';
import useQueryParams from './hooks/useQueryParams';
import { ModalsProvider } from '@mantine/modals';
import useInit from './hooks/useInit';
import { checkForUpdate } from './utils/update';
import { DispatchType } from './types/IEvents';

function SettingWindow() {
  const viewport = useRef<HTMLDivElement>(null);
  const { theme: colorScheme, language, pets, defaultPet } = useSettingStore();
  const { t } = useTranslation();
  const queryParams = useQueryParams();
  const { activeTab, setActiveTab } = useSettingTabStore();

  // check for update when open settings window
  useInit(() => {
    checkForUpdate();
  });

  const toggleColorScheme = (value?: ColorScheme) => {
    const newTheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    handleSettingChange(DispatchType.ChangeAppTheme, newTheme);
  }

  // set active tab from url search params, by doing this user can refresh the page and still get the same tab
  if (queryParams.has('tab') && Number(queryParams.get('tab')) !== activeTab) {
    setActiveTab(Number(queryParams.get('tab')));
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
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{
        colorScheme: colorScheme,
        fontFamily: 'cursive, Siemreap, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
        colors: {
          dark: [
            "#C1C2C5",
            "#A6A7AB",
            "#909296",
            "#5C5F66",
            "#373A40",
            "#2C2E33",
            // shade
            "#1A1B1E",
            // background
            "#141517",
            "#1A1B1E",
            "#101113",
          ],
        },
        primaryColor: PrimaryColor,
      }} withGlobalStyles withNormalizeCSS>
        <ModalsProvider>
          <Notifications limit={3} />
          <AppShell
            padding={0}
            navbar={
              <Navbar width={{ base: 80 }} p="md">
                <Flex style={{
                  height: "100%"
                }} direction={"column"} justify={'space-between'} align={"center"}>
                  <Stack justify="center" align={"center"} spacing={0}>
                    <Logo />
                    <Navbar.Section
                      mt={50}
                    >
                      <Stack justify="center" align={"center"} spacing={0}>
                        <SettingTabs activeTab={activeTab} settingTabs={settingTabs} />
                      </Stack>
                    </Navbar.Section>
                  </Stack>
                  <Navbar.Section>
                    <Stack justify="center" align={"center"} spacing={0}>
                      <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30} >
                        {colorScheme === 'dark' ? <IconSun size="1rem" /> : <IconMoonStars size="1rem" />}
                      </ActionIcon>
                    </Stack>
                  </Navbar.Section>
                </Flex>
              </Navbar>
            }>
            <ScrollArea h={"100vh"} viewportRef={viewport} key={activeTab}>
              <Box m={"sm"}>
                <Title title={settingTabs[activeTab].title} description={settingTabs[activeTab].description} />
                <CurrentSettingTab key={activeTab} />
              </Box>
            </ScrollArea>
          </AppShell>
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default memo(SettingWindow);