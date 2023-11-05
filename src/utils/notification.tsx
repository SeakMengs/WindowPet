import { notifications } from "@mantine/notifications";
import { PrimaryColor } from ".";
import { IconCheck, IconExclamationCircle } from "@tabler/icons-react";

interface showNotificationProps {
    message: string,
    title: string,
    isError?: boolean,
}

export const showNotification = ({
    message,
    title,
    isError = false,
}: showNotificationProps) => {
    notifications.show({
        message: message,
        title: title,
        color: isError ? "red" : PrimaryColor,
        withBorder: true,
        autoClose: 3000,
        icon: isError ? <IconExclamationCircle size="1rem" /> : <IconCheck size="1rem" />,
    });
}