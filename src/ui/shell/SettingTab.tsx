import { UnstyledButton, createStyles, rem, Tooltip } from '@mantine/core';
import { memo } from 'react';
import { ISettingTabProps } from '../../types/components/type';
import { primaryColor } from '../../utils';

const useStyles = createStyles((theme) => ({
  link: {
    width: rem(50),
    height: rem(50),
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
    },
  },

  active: {
    backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
    color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    '&:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).hover,
    },
  },
}));

function SettingTab({ Icon, label, active, handleSetTab }: ISettingTabProps) {
  const { classes, cx } = useStyles();

  return (
    <Tooltip label={label} position="right" transitionProps={{ transition: "fade", duration: 200 }}  withArrow color={primaryColor}>
      <UnstyledButton onClick={handleSetTab} className={cx(classes.link, { [classes.active]: active })}>
        {Icon}
      </UnstyledButton>
    </Tooltip>
  );
}

export default memo(SettingTab);