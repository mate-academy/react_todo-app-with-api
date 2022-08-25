import {
  FC,
  FormEvent,
  memo,
  useEffect,
  useRef,
} from 'react';

interface Props {
  handleSubmit: (event: FormEvent) => void;
  newTitle: string;
  setNewTitle: (newTitle: string) => void;
}

export const EditTodoFrom: FC<Props> = memo(({
  handleSubmit,
  newTitle,
  setNewTitle,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        ref={inputRef}
        placeholder="Empty todo will be deleted"
        value={newTitle}
        onChange={(event) => setNewTitle(event.target.value)}
        onBlur={handleSubmit}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            handleSubmit(event);
          }
        }}
      />
    </form>
  );
});
