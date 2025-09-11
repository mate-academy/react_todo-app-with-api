import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

type Props = {
  errorMsg: string;
  onClose: (msg: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({ errorMsg, onClose }) => {
  const [isHidden, setIsHidden] = useState<boolean>(true);

  useEffect(() => {
    if (errorMsg !== '') {
      setIsHidden(false);
      setTimeout(() => {
        setIsHidden(true);
        onClose('');
      }, 3000);
    }
  }, [errorMsg, onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: isHidden,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          onClose('');
          setIsHidden(true);
        }}
      />
      {errorMsg}
    </div>
  );
};
