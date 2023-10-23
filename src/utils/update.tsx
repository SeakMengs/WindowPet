import {
  checkUpdate,
  installUpdate,
  onUpdaterEvent,
} from '@tauri-apps/api/updater'
import { relaunch } from '@tauri-apps/api/process'
import { modals } from '@mantine/modals';
import Updater from '../ui/pop_up/Updater';
import { info, error } from "tauri-plugin-log-api";
import { ButtonVariant } from '.';
import i18next from 'i18next';

export const checkForUpdate = async () => {
  info('Checking for update');
  try {
    const { shouldUpdate, manifest } = await checkUpdate()

    if (shouldUpdate) {
      modals.openConfirmModal({
        modalId: 'check-for-update',
        centered: true,
        title: i18next.t('Update available'),
        children: <Updater shouldUpdate={shouldUpdate} manifest={manifest} />,
        confirmProps: { variant: ButtonVariant },
        cancelProps: { variant: ButtonVariant, color: 'red' },
        labels: { confirm: i18next.t('Yes'), cancel: i18next.t('No') },
        onConfirm: () => update(),
      });
    }

    info('Update check complete');
    return shouldUpdate;
  } catch (err) {
    error(err as string);
  }
}

export const update = async () => {
  const unlisten = await onUpdaterEvent(({ error, status }) => {
    info(`Updater event Error:${error}, Status${status}`)
    console.log('Updater event', error, status)
  })

  try {
    info('Installing update');
    await installUpdate()
    info('Update installed, relaunching app');
    await relaunch()
  } catch (err) {
    error(err as string);
  } finally {
    unlisten()
  }
}