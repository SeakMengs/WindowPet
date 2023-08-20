import {
  AppShell,
  Navbar,
  Group,
  Box,
  rem,
  Text,
  ActionIcon,
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
  ScrollArea
} from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import Logo from './components/shell/Logo';
import { SettingTabs } from './components/shell/SettingTabs';
import AddPet from './components/setting_tabs/AddPet';
import EditPet from './components/setting_tabs/EditPet';
import Settings from './components/setting_tabs/Settings';
import { useTranslation } from 'react-i18next';
import { useSettingStore } from './hooks/useSettingStore';
import { handleSettingChange } from './utils/handleSettingChange';
import { SettingTabComponentInterface } from './utils/type';
import { useSettingTabStore } from './hooks/useSettingTabStore';
import { useEffect } from 'react';

function SettingWindow() {
  // disable right click (context menu) for build version only. uncomment for development
  // credit: https://github.com/tauri-apps/wry/issues/30
  document.addEventListener('contextmenu', event => event.preventDefault());

  // get object theme change it name to colorScheme for readability
  const { theme: colorScheme, language } = useSettingStore();
  const { t, i18n } = useTranslation();
  const page = useSettingTabStore((state) => state.page);

  const toggleColorScheme = (value?: ColorScheme) => {
    const newTheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    handleSettingChange('changeAppTheme', newTheme);
  }

  useEffect(() => {
    if (language != i18n.language) i18n.changeLanguage(language);
  }, [language]);

  const SettingTabComponent: SettingTabComponentInterface = {
    0: AddPet,
    1: EditPet,
    2: Settings,
  }

  let CurrentSettingTab = SettingTabComponent[page];
  if (!CurrentSettingTab) {
    CurrentSettingTab = () => <Text component='h1'>{t("Seem like the content of this page doesn't exist or has not been updated")}</Text>;
  }

  return (
    //docs: https://mantine.dev/guides/dark-theme/
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{
        colorScheme: colorScheme,
        fontFamily: 'Rubik, Siemreap, cursive, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
      }} withGlobalStyles withNormalizeCSS>
        <AppShell
          padding={0}
          navbar={
            <Navbar height={'100%'} p="xs" width={{ base: 300 }}>
              <Navbar.Section mt="xs">
                <Box
                  sx={(theme) => ({
                    paddingLeft: theme.spacing.xs,
                    paddingRight: theme.spacing.xs,
                    paddingBottom: theme.spacing.lg,
                    borderBottom: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
                      }`,
                  })}
                >
                  <Group position="apart">
                    <Logo />
                    <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30}>
                      {colorScheme === 'dark' ? <IconSun size="1rem" /> : <IconMoonStars size="1rem" />}
                    </ActionIcon>
                  </Group>
                </Box>
              </Navbar.Section>
              <Navbar.Section grow mt="md">
                <SettingTabs />
              </Navbar.Section>
            </Navbar>
          }
        >
          <Box m={"xl"}>
              <CurrentSettingTab />
          </Box>
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default SettingWindow;