import { UnstyledButton, Tooltip } from '@mantine/core';
import { memo } from 'react';
import { ISettingTabProps } from '../../types/components/type';
import { PrimaryColor } from '../../utils';
import clsx from 'clsx';
import classes from "./SettingTab.module.css";

function SettingTab({ Icon, label, active, handleSetTab }: ISettingTabProps) {

  return (
    <>
      <Tooltip label={label} position="right" transitionProps={{ transition: "fade", duration: 200 }} withArrow color={PrimaryColor} style={{
        color: 'white',
      }}>
        <UnstyledButton onClick={handleSetTab}
          className={clsx(classes.link, { [classes.active]: active })}
        >
          {Icon}
        </UnstyledButton>
      </Tooltip>
    </>
  );
}

export default memo(SettingTab);