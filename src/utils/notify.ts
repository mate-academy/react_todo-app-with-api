import toast, { Toast } from 'react-hot-toast';
import { NotificationType } from '../enums/NotificationType';

const notificationDurationsByType = {
  [NotificationType.Success]: 1000,
  [NotificationType.Error]: 3000,
  [NotificationType.Loading]: 500,
};

export const notify = (message: string, type: NotificationType) => {
  const options: Partial<Toast> = {
    position: 'top-center',
    duration: notificationDurationsByType[type],
    iconTheme: {
      primary: '#FFA62B',
      secondary: '#0F1108',
    },
  };

  switch (type) {
    case NotificationType.Error:
      toast.error(message, options);
      break;
    case NotificationType.Success:
      toast.success(message, options);
      break;
    case NotificationType.Loading:
      toast.loading(message, options);
      break;
    default:
      toast(message);
  }
};
