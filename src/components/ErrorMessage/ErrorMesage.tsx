import classNames from 'classnames';

type Props = {
  isAddError: string;
  isDeleteError: string;
  isUpdateError: string;
  isLoadingError: string;
  setIsAddError: (error: string) => void;
  setIsUpdateError: (error: string) => void;
  setIsDeleteError: (error: string) => void;
  setIsLoadingError: (error: string) => void;
};

export const ErrorMessage: React.FC<Props> = ({
  isUpdateError,
  isAddError,
  isDeleteError,
  isLoadingError,
  setIsAddError,
  setIsUpdateError,
  setIsDeleteError,
  setIsLoadingError,
}) => {
  if (isAddError || isUpdateError || isDeleteError || isLoadingError) {
    setTimeout(() => {
      setIsAddError('');
      setIsUpdateError('');
      setIsDeleteError('');
      setIsLoadingError('');
    }, 3000);
  }

  const cleanErrors = () => {
    setIsAddError('');
    setIsUpdateError('');
    setIsDeleteError('');
    setIsLoadingError('');
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !(
            isAddError ||
            isUpdateError ||
            isDeleteError ||
            isLoadingError
          ),
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={cleanErrors}
      />
      {/* show only one message at a time */}
      {isAddError || isUpdateError || isDeleteError || isLoadingError}
      {/* <br />
    <br />
    Unable to update a todo */}
    </div>
  );
};
