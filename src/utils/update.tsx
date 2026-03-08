import { check, Update } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'
import { modals } from '@mantine/modals';
import Updater from '../ui/pop_up/Updater';
import { info, error } from "@tauri-apps/plugin-log";
import { ButtonVariant } from '.';
import i18next from 'i18next';

export const checkForUpdate = async () => {
  info('Checking for update');
  try {
    const update = await check();

    if (update) {
      modals.openConfirmModal({
        modalId: 'check-for-update',
        centered: true,
        title: i18next.t('Update available'),
        children: <Updater update={update} />,
        confirmProps: { variant: ButtonVariant },
        cancelProps: { variant: ButtonVariant, color: 'red' },
        labels: { confirm: i18next.t('Yes'), cancel: i18next.t('No') },
        onConfirm: () => installUpdate(update),
      });
    }

    info('Update check complete');
    return update !== null;
  } catch (err) {
    error(err as string);
  }
}

export const installUpdate = async (update: Update) => {
  try {
    info('Installing update');
    await update.downloadAndInstall();
    info('Update installed, relaunching app');
    await relaunch();
  } catch (err) {
    error(err as string);
  }
}
