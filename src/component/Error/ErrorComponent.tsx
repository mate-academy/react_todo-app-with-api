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

export const ErrorComponent: React.FC<Props> = ({
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

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${isAddError || isUpdateError || isDeleteError || isLoadingError ? '' : 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setIsAddError('');
          setIsUpdateError('');
          setIsDeleteError('');
          setIsLoadingError('');
        }}
      />
      {/* show only one message at a time */}
      {isAddError || isUpdateError || isDeleteError || isLoadingError}
      {/* <br />
    <br />
    Unable to update a todo */}
    </div>
  );
};
