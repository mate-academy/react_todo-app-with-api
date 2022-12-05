import classNames from 'classnames';
import { useContext, useEffect, useState } from 'react';
import { ErrorContext } from './ErrorContext';

enum ErrorMessage {
  Load = 'Unable to load your todos',
  EmptyTitle = 'Title can`t be empty',
  Update = 'Unable to update todo',
  Delete = 'Unable to delete todo',
  Add = 'Unable to add todo',
}

export const ErrorNotification = () => {
  const {
    isTogglingErrorShown,
    setIsTogglingErrorShown,
    isRemoveErrorShown,
    setIsRemoveErrorShown,
    hasLoadingError,
    setHasLoadingError,
    isEmptyTitleErrorShown,
    setIsEmptyTitleErrorShown,
    isAddingErrorShown,
    setIsAddingErrorShown,
  } = useContext(ErrorContext);

  const [isClosePressed, setIsClosePressed] = useState(false);
  const hideErrorHandler = () => {
    setIsClosePressed(true);
    setIsEmptyTitleErrorShown(false);
    if (setIsTogglingErrorShown) {
      setIsTogglingErrorShown(false);
    }
  };

  const isErrorHidden = (!hasLoadingError || isClosePressed)
    && !isEmptyTitleErrorShown
    && !isTogglingErrorShown
    && !isRemoveErrorShown
    && !isAddingErrorShown;

  useEffect(() => {
    const setErrors = () => {
      setHasLoadingError(false);
      setIsEmptyTitleErrorShown(false);
      setIsTogglingErrorShown(false);
      setIsRemoveErrorShown(false);
      setIsAddingErrorShown(false);
    };

    const timer = setTimeout(setErrors, 3000);

    return () => clearTimeout(timer);
  }, [
    isEmptyTitleErrorShown,
    isTogglingErrorShown,
    isRemoveErrorShown,
    isAddingErrorShown,
  ]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: isErrorHidden },
      )}
    >
      <button
        aria-label="delete"
        type="button"
        data-cy="HideErrorButton"
        className="delete"
        onClick={hideErrorHandler}
      />
      {hasLoadingError && ErrorMessage.Load}
      {isEmptyTitleErrorShown && !hasLoadingError && ErrorMessage.EmptyTitle}
      {isTogglingErrorShown && !hasLoadingError && ErrorMessage.Update}
      {isRemoveErrorShown && !hasLoadingError && ErrorMessage.Delete}
      {isAddingErrorShown && !hasLoadingError && ErrorMessage.Add}
      <br />
    </div>
  );
};
