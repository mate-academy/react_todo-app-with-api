import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
// Hooks
import { useAppDispatch } from '../hooks/useAppDispatch';
// Async
import { signIn, signUp } from '../store/auth/authAsync';
// Actions
import { appActions } from 'store/app/appSlice';
// Types
import NotificationStatuses from 'types/NotificationStatuses';
// components
import Title from 'components/Title';
// mui
import { LoadingButton } from '@mui/lab';
import { makeStyles } from '@mui/styles';
import {
  TextField, Grid, Box, Paper,
} from '@mui/material';
// utilites
import { isEmail, isRequired } from 'utilities/Validation';

interface IForm {
  email: string;
  name: string;
}

const SignInPage: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const [fieldName, setFieldName] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    control, handleSubmit, formState: { errors }, watch,
  } = useForm<IForm>({
    defaultValues: {
      email: '',
      name: '',
    },
  });

  const emailWatcher = watch('email');

  const onSubmit = handleSubmit((data: IForm) => {
    setIsLoading(true);
    const { email } = data;

    if (fieldName) {
      dispatch(signUp(data))
        .unwrap()
        .then(() => dispatch(appActions.enqueueSnackbar({ key: uuid(), message: `User with email ${emailWatcher} successfully registered`, options: { variant: NotificationStatuses.Success } })))
        .finally(() => setIsLoading(false));
    } else {
      dispatch(signIn(email))
        .unwrap()
        .catch(() => {
          setFieldName(true);
          dispatch(appActions.enqueueSnackbar({ key: uuid(), message: `User with email ${emailWatcher} not found`, options: { variant: NotificationStatuses.Error } }));
        })
        .finally(() => setIsLoading(false));
    }
  });

  return (
    <Box className={classes.page}>
      <Paper elevation={5} sx={{ p: 5, width: '600px' }}>
        <Title>{ fieldName ? 'Sign Up' : 'Sign In' }</Title>
        <form onSubmit={onSubmit} noValidate>
          <Grid container spacing={2} sx={{ pt: 4, pb: 4 }}>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="email"
                rules={{ required: isRequired, pattern: isEmail }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="E-mail"
                    disabled={fieldName}
                    fullWidth
                    autoComplete="email"
                    required
                    error={!!errors?.email}
                    helperText={errors?.email ? errors.email.message : null}
                  />
                )}
              />
            </Grid>
            {fieldName && (
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: isRequired }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Name"
                      fullWidth
                      required
                      error={!!errors?.name}
                      helperText={errors?.name ? errors.name.message : null}
                    />
                  )}
                />
              </Grid>
            )}
          </Grid>
          <LoadingButton
            fullWidth
            loading={isLoading}
            type="submit"
            variant="contained"
            color="primary"
          >
            { fieldName ? 'Sign Up' : 'Sign In' }
          </LoadingButton>
        </form>
      </Paper>
    </Box>
  );
};

export default SignInPage;

const useStyles = makeStyles({
  page: {
    height: 'calc(100vh - 64px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
