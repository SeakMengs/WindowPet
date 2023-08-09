import { ThemeIcon, UnstyledButton, Group, Text } from '@mantine/core';
import { useSettingTabStore } from './SettingTabs';

interface SettingTabProps {
    icon: React.ReactNode;
    color: string;
    label: string;
    index: number;
}

function SettingTab({ icon, color, label, index }: SettingTabProps) {
    const setPage = useSettingTabStore((state) => state.setPage);

    return (
        <UnstyledButton
            onClick={() => setPage(index)}
            sx={(theme) => ({
                display: 'block',
                width: '100%',
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

                '&:hover': {
                    backgroundColor:
                        theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                },
            })}
        >
            <Group>
                <ThemeIcon color={color} variant="light">
                    {icon}
                </ThemeIcon>

                <Text size="sm">{label}</Text>
            </Group>
        </UnstyledButton>
    );
}

export default SettingTab;