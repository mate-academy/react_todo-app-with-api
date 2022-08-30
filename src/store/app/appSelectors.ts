import { RootState } from '..';

export const selectNotifications = (state:RootState) => state.app.notifications;
