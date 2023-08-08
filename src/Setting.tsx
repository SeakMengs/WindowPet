import { useState } from 'react';
import {
  AppShell,
  Navbar,
  Group,
  Box,
  rem,
  Text,
  ActionIcon
} from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import Logo from './components/shell/Logo';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from "@mantine/core";
import { SettingTabs, useSettingTabStore } from './components/shell/SettingTabs';
import AddPet from './components/setting_tabs/AddPet';
import EditPet from './components/setting_tabs/EditPet';
import Settings from './components/setting_tabs/Settings';

interface SettingTabComponentInterface {
  [key: number]: () => JSX.Element;
}

function Setting() {
  // disable right click (context menu) for build version only. uncomment for development
  // credit: https://github.com/tauri-apps/wry/issues/30
  document.addEventListener('contextmenu', event => event.preventDefault());

  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const page = useSettingTabStore((state) => state.page);

  const SettingTabComponent: SettingTabComponentInterface = {
    0: AddPet,
    1: EditPet,
    2: Settings,
  }

  let CurrentSettingTab = SettingTabComponent[page];

  if (!CurrentSettingTab) {
    CurrentSettingTab = () => <Text component='h1'>Seem like the content of this page doesn't exist or has not been updated.</Text>;
  }

  return (
    //docs: https://mantine.dev/guides/dark-theme/
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <AppShell
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
              {/* <Navbar.Section>
                <User />
              </Navbar.Section> */}
            </Navbar>
          }
        >
          {/* <Text>Resize app to see responsive navbar in action {page}</Text> */}
          <CurrentSettingTab />
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default Setting;