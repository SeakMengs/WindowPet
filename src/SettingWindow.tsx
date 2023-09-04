import {
  AppShell,
  Navbar,
  Box,
  Text,
  ActionIcon,
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
  ScrollArea,
  Stack,
  Flex,
} from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import Logo from './ui/shell/Logo';
import SettingTabs from './ui/shell/SettingTabs';
import { useTranslation } from 'react-i18next';
import { useSettingStore } from './hooks/useSettingStore';
import { handleSettingChange } from './utils/handleSettingChange';
import { ISettingTabComponent } from './types/ISetting';
import { memo, useEffect } from 'react';
import MyPets from './ui/setting_tabs/MyPets';
import PetShop from './ui/setting_tabs/PetShop';
import Settings from './ui/setting_tabs/Settings';
import { useSettingTabStore } from './hooks/useSettingTabStore';
import Title from './ui/components/Title';

function SettingWindow() {
  const { theme: colorScheme, language } = useSettingStore();
  const { t, i18n } = useTranslation();
  const { activeTab } = useSettingTabStore();

  const toggleColorScheme = (value?: ColorScheme) => {
    const newTheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    handleSettingChange('changeAppTheme', newTheme);
  }

  useEffect(() => {
    if (language != i18n.language) i18n.changeLanguage(language);
  }, [language]);

  const SettingTabComponent: ISettingTabComponent[] = [
    {
      component: MyPets,
      title: t("My Pets"),
      description: t("Meet your furry friend, a loyal companion who loves to play and cuddle"),
    },
    {
      component: PetShop,
      title: t("Pet Shop"),
      description: t("Meet your furry friend, a loyal companion who loves to play and cuddle"),
    },
    {
      component: Settings,
      title: t("Setting Preferences"),
      description: t("Choose what u desire, do what u love")
    },
    {
      component: Settings,
      title: t("Setting Preferences"),
      description: t("Choose what u desire, do what u love")
    },
  ]
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
        primaryColor: 'pink',
      }} withGlobalStyles withNormalizeCSS>
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
                    <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30}>
                      {colorScheme === 'dark' ? <IconSun size="1rem" /> : <IconMoonStars size="1rem" />}
                    </ActionIcon>
                  </Stack>
                </Navbar.Section>
              </Flex>
            </Navbar>
          }>
          <ScrollArea style={{
            height: "100vh",
          }}>
            <Box m={"sm"}>
              <Title title={SettingTabComponent[activeTab].title} description={SettingTabComponent[activeTab].description} />
              <CurrentSettingTab />
            </Box>
          </ScrollArea>
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default memo(SettingWindow);