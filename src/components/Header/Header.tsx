import React, {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';

type Props = {
  isLeftActiveTodos: boolean;
  onAddTodo: (inputTitle: string) => void,
  isDisabled: boolean,
  setErrorMessage: (error: string) => void,
  activeTodosIds: number[],
  completedTodosIds: number[],
  onUpdate: (
    name: string,
    type: string,
    value: string | boolean,
    id: number[],
  ) => void;
};

export const Header: React.FC<Props> = ({
  isLeftActiveTodos,
  onAddTodo,
  isDisabled,
  setErrorMessage,
  activeTodosIds,
  completedTodosIds,
  onUpdate,
}) => {
  const [inputTitle, setInputTitle] = useState('');
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isDisabled]);

  const onAdd = (event: FormEvent) => {
    event.preventDefault();
    if (!inputTitle.trim()) {
      setErrorMessage("Title can't be empty");
      setInputTitle('');

      return;
    }

    onAddTodo(inputTitle);
    setInputTitle('');
  };

  const todosId = activeTodosIds.length ? activeTodosIds : completedTodosIds;

  return (
    <header className="todoapp__header">
      <button
        name="completed"
        aria-label="active"
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: !isLeftActiveTodos },
        )}
        value={isLeftActiveTodos ? 'true' : 'false'}
        onClick={(event) => onUpdate(
          event.currentTarget.name,
          event.currentTarget.type,
          event.currentTarget.value,
          todosId,
        )}
      />

      <form onSubmit={onAdd}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabled}
          value={inputTitle}
          onChange={(event) => setInputTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
