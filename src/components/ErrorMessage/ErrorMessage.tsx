/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { Errors } from '../../types/Errors';

type Props = {
  errorMessage: string,
  setErrorMessage: (value: Errors | null) => void;
};

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={
        cn('notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage })
      }
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(null)}
      />
      {errorMessage}
    </div>
  );
};
