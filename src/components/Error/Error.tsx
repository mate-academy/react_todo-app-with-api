import { ErrorSpec } from '../../types/ErrorSpec';

type Props = {
  error: ErrorSpec | null;
  onHideError: () => void;
};

export const Errors: React.FC<Props> = ({ error, onHideError: closeError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Hide error"
        onClick={closeError}
      />

      {error && <span>{error}</span>}
    </div>
  );
};
