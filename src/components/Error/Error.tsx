/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { FC } from 'react';
import { renderSwitch } from '../../utils/errorUtils';
import { ErrorMessage } from '../../types/ErrorEnum';

interface Props {
  hasError: boolean;
  error: ErrorMessage;
  onClose: () => void;
}

export const Error: FC<Props> = (
  {
    hasError,
    onClose,
    error,
  },
) => {
  return (
    <div className={
      classNames('notification is-danger is-light has-text-weight-normal', {
        hidden: !hasError,
      })
    }
    >
      <button
        type="button"
        className="delete"
        onClick={onClose}
      />
      {renderSwitch(error)}
    </div>
  );
};
