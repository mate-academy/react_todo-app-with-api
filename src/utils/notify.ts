import toast from 'react-hot-toast';
import { NotificationDuration } from '../enums/NotificationDuration';
import { NotificationType } from '../enums/NotificationType';

export const notify = (message: string, type: NotificationType) => {
  const position = 'top-center';
  const iconTheme = {
    primary: '#FFA62B',
    secondary: '#0F1108',
  };

  switch (type) {
    case NotificationType.Error:
      toast.error(message, {
        duration: NotificationDuration.Error,
        position,
        iconTheme,
      });
      break;
    case NotificationType.Success:
      toast.success(message, {
        duration: NotificationDuration.Success,
        position,
        iconTheme,
      });
      break;
    case NotificationType.Loading:
      toast.loading(message, {
        duration: NotificationDuration.Loading,
        position,
      });
      break;
    default:
      toast(message);
  }
};
