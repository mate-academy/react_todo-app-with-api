/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC } from 'react';

interface Props {
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ErorMesage: FC<Props> = ({ setErrorMessage }) => {
  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage(null)}
      />
      <p>Unable to create a todos</p>
    </div>
  );
};
