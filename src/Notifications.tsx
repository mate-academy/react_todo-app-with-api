import { useEffect, useState } from 'react';

interface NotificationsProps {
  removeTodoIsClicked: boolean,
  setRemoveTodoIsClicked: React.Dispatch<React.SetStateAction<boolean>>,
  editTodoIsClicked: boolean,
  setEditTodoIsClicked: React.Dispatch<React.SetStateAction<boolean>>,
  onEmptyFormSubmit: boolean,
  setOnEmptyFormSubmit: React.Dispatch<React.SetStateAction<boolean>>,
  toggleTodoIsFailed: boolean,
  setToggleTodoIsFailed: React.Dispatch<React.SetStateAction<boolean>>,
}

export const Notifications: React.FC<NotificationsProps> = ({
  removeTodoIsClicked,
  setRemoveTodoIsClicked,
  editTodoIsClicked,
  setEditTodoIsClicked,
  onEmptyFormSubmit,
  setOnEmptyFormSubmit,
  toggleTodoIsFailed,
  setToggleTodoIsFailed,
}) => {
  const [isNotificationHidden,
    setIsNotificationHidden] = useState(false);

  const hideNotification = () => {
    setIsNotificationHidden(true);
    setRemoveTodoIsClicked(false);
    setEditTodoIsClicked(false);
    setOnEmptyFormSubmit(false);
    setToggleTodoIsFailed(false);
  };

  const showErrorText = () => {
    if (removeTodoIsClicked) {
      return 'Unable to delete a todo';
    }

    if (editTodoIsClicked) {
      return 'Unable to edit a todo';
    }

    if (onEmptyFormSubmit) {
      return 'Title can\'t be empty';
    }

    if (toggleTodoIsFailed) {
      return 'Unable to update a todo';
    }

    return null;
  };

  useEffect(() => {
    if (!isNotificationHidden) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [isNotificationHidden]);

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={hideNotification}
        aria-label="Hide Notification"
      />
      <span>{showErrorText()}</span>
    </div>
  );
};
