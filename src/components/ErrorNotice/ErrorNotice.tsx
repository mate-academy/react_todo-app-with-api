import classNames from 'classnames';
import React, { useEffect } from 'react';
import { ErrorNoticeType } from '../../types/ErrorNoticeType';

interface Props {
  errorNotice: ErrorNoticeType,
  setErrorNotice: (type: ErrorNoticeType) => void,
}

export const ErrorNotice: React.FC<Props> = ({
  errorNotice,
  setErrorNotice,
}) => {
  useEffect(() => {
    setTimeout(() => setErrorNotice(ErrorNoticeType.None), 3000);
  }, [setErrorNotice]);

  const closeErrorNotice = () => setErrorNotice(ErrorNoticeType.None);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal', {
          hidden: errorNotice === ErrorNoticeType.None,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        aria-label="Close error notice"
        className="delete"
        onClick={closeErrorNotice}
      />

      {errorNotice}
    </div>
  );
};
