import React from 'react';
import {
  IconCat ,
  IconAdjustmentsHorizontal ,
  IconPawFilled ,
  IconInfoCircle ,
} from '@tabler/icons-react';
import { ThemeIcon, UnstyledButton, Group, Text } from '@mantine/core';
import { create } from 'zustand';

interface SettingSectionProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  index: number;
}

interface SettingSectionState {
  page: number;
  setPage: (page: number) => void;
}

export const useSettingSectionStore = create<SettingSectionState>((set) => ({
  page: 1,
  setPage: (page: number) => set({ page }),
}));

function SettingSection({ icon, color, label, index }: SettingSectionProps) {
  const setPage = useSettingSectionStore((state) => state.setPage);

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

const data = [
  { icon: <IconCat size="1rem" />, color: 'blue', label: 'Add Pet' },
  { icon: <IconPawFilled  size="1rem" />, color: 'teal', label: 'Edit Pet' },
  { icon: <IconAdjustmentsHorizontal size="1rem" />, color: 'violet', label: 'Settings' },
  { icon: <IconInfoCircle  size="1rem" />, color: 'grape', label: 'About' },
];

export function SettingSections() {
  const sections = data.map((link, index) => <SettingSection {...link} key={link.label} index={index} />);
  return <div>{sections}</div>;
}