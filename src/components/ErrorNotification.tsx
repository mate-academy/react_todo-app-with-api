import classNames from 'classnames';
import { useContext, useEffect, useState } from 'react';
import { ErrorContext } from './ErrorContext';

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

  const isErrorHidden = (((!hasLoadingError || isClosePressed)
  && !isEmptyTitleErrorShown) && !isTogglingErrorShown) && !isRemoveErrorShown
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
        onClick={() => {
          setIsClosePressed(true);
          setIsEmptyTitleErrorShown(false);
          if (setIsTogglingErrorShown) {
            setIsTogglingErrorShown(false);
          }
        }}
      />
      {hasLoadingError && ('Unable to load your todos')}
      {isEmptyTitleErrorShown && !hasLoadingError && ('Title can`t be empty')}
      {isTogglingErrorShown && !hasLoadingError && ('Unable to update todo')}
      {isRemoveErrorShown && !hasLoadingError && ('Unable to delete todo')}
      {isAddingErrorShown && !hasLoadingError && ('Unable to add todo')}
      <br />
    </div>
  );
};
