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
import Logo from './ui/shell/Logo';
import SettingTabs from './ui/shell/SettingTabs';
import AddPet from './ui/setting_tabs/AddPet';
import EditPet from './ui/setting_tabs/EditPet';
import Settings from './ui/setting_tabs/Settings';
import { useTranslation } from 'react-i18next';
import { useSettingStore } from './hooks/useSettingStore';
import { handleSettingChange } from './utils/handleSettingChange';
import { ISettingTabComponent } from './types/ISetting';
import { useSettingTabStore } from './hooks/useSettingTabStore';
import { memo, useEffect } from 'react';

function SettingWindow() {
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

  const SettingTabComponent: ISettingTabComponent = {
    0: AddPet,
    1: EditPet,
    2: Settings,
  }

  let CurrentSettingTab = SettingTabComponent[page];

  if (!CurrentSettingTab) {
    CurrentSettingTab = memo(() => <Text component='h1'>{t("Seem like the content of this page doesn't exist or has not been updated")}</Text>);
  }

  return (
    //docs: https://mantine.dev/guides/dark-theme/
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{
        colorScheme: colorScheme,
        fontFamily: 'cursive, Siemreap, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
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
          <ScrollArea style={{
            height: "100vh"
          }}>
            <Box m={"xl"}>
              <CurrentSettingTab />
            </Box>
          </ScrollArea>
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default memo(SettingWindow);