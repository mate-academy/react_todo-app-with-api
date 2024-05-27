import { useEffect } from 'react';
import { ErroMessage } from '../utils/errorMessages';
const milliseconds = 3000;

type Props = {
  errorMesage: string;
  handleErrorMessages: (newErrorMessage?: ErroMessage, hidden?: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMesage,
  handleErrorMessages,
}) => {
  useEffect(() => {
    const id = window.setTimeout(() => {
      handleErrorMessages(ErroMessage.NO_ERRORS);
    }, milliseconds);

    return () => {
      window.clearTimeout(id);
    };
  }, [errorMesage, handleErrorMessages]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${errorMesage.length === 0 ? 'hidden' : ''}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete hidden"
        onClick={() => handleErrorMessages(ErroMessage.NO_ERRORS)}
      />
      {errorMesage}
    </div>
  );
};
