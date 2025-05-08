type Props = {
  isError: string;
  isUpdateError: string;
  setError: (error: string) => void;
  setIsUpdateError: (error: string) => void;
  isDeleteError: string;
  setIsDeleteError: (error: string) => void;
};

export const ErrorComponent: React.FC<Props> = ({
  isUpdateError,
  isError,
  isDeleteError,
  setError,
  setIsUpdateError,
  setIsDeleteError,
}) => {
  if (isError || isUpdateError || isDeleteError) {
    setTimeout(() => {
      setError('');
      setIsUpdateError('');
      setIsDeleteError('');
    }, 3000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${isError || isUpdateError || isDeleteError ? '' : 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setError('');
          setIsUpdateError('');
          setIsDeleteError('');
        }}
      />
      {/* show only one message at a time */}
      {isError || isUpdateError || isDeleteError}
      {/* <br />
    <br />
    Unable to update a todo */}
    </div>
  );
};
