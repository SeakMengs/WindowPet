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
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import Logo from './ui/components/Logo';
import SettingTabs from './ui/shell/SettingTabs';
import { useTranslation } from 'react-i18next';
import { useSettingStore } from './hooks/useSettingStore';
import { handleSettingChange } from './utils/handleSettingChange';
import { ISettingTabComponent } from './types/ISetting';
import { memo, useCallback, useMemo, useRef } from 'react';
import MyPets from './ui/setting_tabs/MyPets';
import PetShop from './ui/setting_tabs/PetShop';
import Settings from './ui/setting_tabs/Settings';
import { useSettingTabStore } from './hooks/useSettingTabStore';
import Title from './ui/components/Title';
import { PrimaryColor } from './utils';
import { Notifications } from '@mantine/notifications';
import About from './ui/setting_tabs/About';
import useQueryParams from './hooks/useQueryParams';

function SettingWindow() {
  const viewport = useRef<HTMLDivElement>(null);
  const { theme: colorScheme, language, pets } = useSettingStore();
  const { t } = useTranslation();
  const queryParams = useQueryParams();
  const { activeTab, setActiveTab } = useSettingTabStore();
  
  const toggleColorScheme = (value?: ColorScheme) => {
    const newTheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    handleSettingChange('changeAppTheme', newTheme);
  }

  const scrollToTop = useCallback(() => viewport!.current!.scrollTo({ top: 0, behavior: 'smooth' }), []);
  
  // set active tab from url search params, by doing this user can refresh the page and still get the same tab
  if (queryParams.has('tab') && Number(queryParams.get('tab')) !== activeTab) {
    setActiveTab(Number(queryParams.get('tab')));
  }

  const SettingTabComponent: ISettingTabComponent[] = useMemo(() => ([
    {
      component: MyPets,
      title: t("My Pets", { totalPets: pets.length }),
      description: t("Meet your furry friend, a loyal companion who loves to play and cuddle"),
    },
    {
      component: PetShop,
      title: t("Pet Shop"),
      description: t("Browse wide selection of adorable pets, find your perfect companion today!"),
    },
    {
      component: Settings,
      title: t("Setting Preferences"),
      description: t("Choose what u desire, do what u love")
    },
    {
      component: About,
      title: t("About"),
      description: t("Know more about WindowPet")
    },
  ]), [language, pets.length]);
  let CurrentSettingTab = SettingTabComponent[activeTab]?.component;

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
                      <SettingTabs activeTab={activeTab} />
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
          <ScrollArea h={"100vh"} viewportRef={viewport}>
            <Box m={"sm"}>
              <Title title={SettingTabComponent[activeTab].title} description={SettingTabComponent[activeTab].description} />
              <CurrentSettingTab scrollToTop={scrollToTop} />
            </Box>
          </ScrollArea>
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default memo(SettingWindow);