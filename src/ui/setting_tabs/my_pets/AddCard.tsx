import { Box, Button, createStyles } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useSettingTabStore } from "../../../hooks/useSettingTabStore";

const useStyles = createStyles((theme) => ({
    plus: {
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
        '&:hover': {
            color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).hover,
        }
    },
}));

function AddCard() {
    const { setActiveTab } = useSettingTabStore();
    const { classes } = useStyles();

    return (
        // tab index 1 is Pet Store
        <Box onClick={() => setActiveTab(1)} sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
            maxWidth: '14rem',
            borderRadius: theme.radius.md,
            boxShadow: theme.shadows.md,
            border: `0.0625rem solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
            padding: theme.spacing.lg,
            width: '224px',
            height: '370px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            '&:hover': {
                cursor: 'pointer'
            }
        })}>
            <IconPlus size={128} className={classes.plus} />
            {/* <Button variant="light" fullWidth radius="md">
                Add More Pet
            </Button> */}
        </Box>
    )
}

export default AddCard;