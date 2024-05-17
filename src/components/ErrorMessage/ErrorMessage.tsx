import { ErrorType } from '../../types/ErrorType';

type Props = {
  errorMessage: ErrorType | null;
  clear: () => void;
};

export const ErrorMessage: React.FC<Props> = ({ errorMessage, clear }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal
  ${!errorMessage && 'hidden'}`}
    >
      <button
        onClick={() => clear()}
        data-cy="HideErrorButton"
        type="button"
        className="delete"
      />
      {errorMessage}
    </div>
  );
};
