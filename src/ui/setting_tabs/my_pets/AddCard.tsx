import { Box, createStyles } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useSearchParams } from "react-router-dom";

const useStyles = createStyles((theme) => ({
    plus: {
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
        '&:hover': {
            color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).hover,
        }
    },
}));

function AddCard({ scrollToTop }: { scrollToTop: () => void }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const { classes } = useStyles();

    return (
        // tab index 1 is Pet Store
        <Box onClick={() => {
            searchParams.set('tab', '1');
            setSearchParams(searchParams);
            scrollToTop();
        }}
            sx={(theme) => ({
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
                maxWidth: '14rem',
                borderRadius: theme.radius.md,
                boxShadow: theme.shadows.md,
                border: `0.0625rem solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                padding: theme.spacing.lg,
                width: '224px',
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                '&:hover': {
                    cursor: 'pointer',
                }
            })}>
            <IconPlus size={128} className={classes.plus} />
        </Box>
    )
}

export default AddCard;