import { appActions } from 'store/app/appSlice';
import NotificationStatuses from 'types/NotificationStatuses';
import { v4 as uuid } from 'uuid';

const errorMiddleware = ({ dispatch }: any) => (next: any) => (action: any) => {
  const { type, payload } = action;

  if (type.endsWith('/rejected') && type !== 'auth/signIn/rejected') {
    dispatch(appActions.enqueueSnackbar({
      key: uuid(),
      message: payload?.message || 'Server error',
      options: { variant: NotificationStatuses.Error },
    }));
  }

  return next(action);
};

export default errorMiddleware;
