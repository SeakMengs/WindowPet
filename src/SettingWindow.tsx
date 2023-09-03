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
  ScrollArea,
  Center,
  Stack,
  Flex
} from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import Logo from './ui/shell/Logo';
import SettingTabs from './ui/shell/SettingTabs';
import { useTranslation } from 'react-i18next';
import { useSettingStore } from './hooks/useSettingStore';
import { handleSettingChange } from './utils/handleSettingChange';
import { ISettingTabComponent } from './types/ISetting';
import { memo, useEffect, useState } from 'react';
import MyPet from './ui/setting_tabs/MyPet';
import EditPet from './ui/setting_tabs/EditPet';
import Settings from './ui/setting_tabs/Settings';

function SettingWindow() {
  const { theme: colorScheme, language } = useSettingStore();
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<number>(0);

  const toggleColorScheme = (value?: ColorScheme) => {
    const newTheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    handleSettingChange('changeAppTheme', newTheme);
  }

  useEffect(() => {
    if (language != i18n.language) i18n.changeLanguage(language);
  }, [language]);

  const SettingTabComponent: ISettingTabComponent = {
    0: MyPet,
    1: EditPet,
    2: Settings,
  }

  let CurrentSettingTab = SettingTabComponent[activeTab];

  if (!CurrentSettingTab) {
    CurrentSettingTab = memo(() => <Text component='h1'>{t("Seem like the content of this page doesn't exist or has not been updated")}</Text>);
  }

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{
        colorScheme: colorScheme,
        fontFamily: 'cursive, Siemreap, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
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
                    <SettingTabs setActiveTab={setActiveTab} activeTab={activeTab} />
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
              <CurrentSettingTab />
            </Box>
          </ScrollArea>
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default memo(SettingWindow);