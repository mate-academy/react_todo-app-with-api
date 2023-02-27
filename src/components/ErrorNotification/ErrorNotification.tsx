import React, {
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import classNames from 'classnames';
import { debounce } from 'lodash';
import { ErrorMessages } from '../../types/ErrorMessages';

type Props = {
  errorMessage: string,
  setErrorMessage: Dispatch<SetStateAction<ErrorMessages>>,
};

export const ErrorNotification: React.FC<Props> = React.memo(({
  errorMessage,
  setErrorMessage,
}) => {
  const [isHidden, setIsHidden] = useState(false);

  const handleCloseClick = () => {
    setIsHidden(true);
    setErrorMessage(ErrorMessages.NoError);
  };

  const closeNotification = useCallback(debounce(handleCloseClick, 3000), []);

  if (!isHidden) {
    closeNotification();
  }

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: isHidden },
    )}
    >
      <button
        type="button"
        aria-label="Close notification"
        className="delete"
        onClick={handleCloseClick}
      />

      { errorMessage }
    </div>
  );
});
