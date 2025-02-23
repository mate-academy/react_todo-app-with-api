import React from 'react';

type Props = {
  showErrorBox: boolean;
  textOfError: string | null;
};

export const ErrorMessage: React.FC<Props> = ({
  showErrorBox,
  textOfError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${!showErrorBox && 'hidden'}`}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {textOfError}
    </div>
  );
};
