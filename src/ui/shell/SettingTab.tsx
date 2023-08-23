import { ThemeIcon, UnstyledButton, Group, Text } from '@mantine/core';
import { ISettingTabProps } from '../../types/ISetting';
import { memo } from 'react';

function SettingTab({ icon, color, label, index, handleSetTab }: ISettingTabProps) {
    return (
        <UnstyledButton
            onClick={() => handleSetTab(index)}
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

export default memo(SettingTab);