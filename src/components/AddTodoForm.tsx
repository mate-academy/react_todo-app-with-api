import {
  FC,
  FormEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
} from 'react';

interface Props {
  onAdd: (title: string) => void;
  newTodoTitle: string;
  setNewTodoTitle: (value: string) => void;
  isDisabled: boolean;
  setErrorWithTimer: (value: string) => void;
}

export const AddTodoForm: FC<Props> = memo(({
  onAdd,
  newTodoTitle,
  setNewTodoTitle,
  isDisabled,
  setErrorWithTimer,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current && !isDisabled) {
      newTodoField.current.disabled = false;
      newTodoField.current.focus();
    }
  }, [isDisabled]);

  useEffect(() => {
    if (newTodoField.current && !isDisabled) {
      newTodoField.current.blur();
    }
  }, []);

  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();
    if (newTodoTitle) {
      if (newTodoField.current) {
        newTodoField.current.disabled = true;
      }

      onAdd(newTodoTitle);
    } else {
      setErrorWithTimer('Title can\'t be empty');
    }
  }, [onAdd, newTodoField, newTodoTitle]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={(event) => setNewTodoTitle(event.target.value)}
      />
    </form>
  );
});
