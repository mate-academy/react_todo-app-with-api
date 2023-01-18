type Props = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  currentTitle: string,
  setCurrentTitle: React.Dispatch<React.SetStateAction<string>>,
  onBlur: () => void,
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void,
};

export const TodoTitleField: React.FC<Props> = ({
  onSubmit,
  currentTitle,
  setCurrentTitle,
  onKeyDown,
  onBlur,
}) => {
  return (
    <form onSubmit={e => onSubmit(e)}>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        defaultValue={currentTitle}
        value={currentTitle}
        onChange={(event) => setCurrentTitle(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      />
    </form>
  );
};
