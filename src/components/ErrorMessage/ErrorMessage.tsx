import React from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string,
  onClose: () => void,
};

export const ErrorMessage = React.memo<Props>((props) => {
  const {
    errorMessage,
    onClose,
  } = props;

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        aria-label="close"
        type="button"
        className="delete"
        onClick={onClose}
      />

      {errorMessage}
    </div>
  );
});
