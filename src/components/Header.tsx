import cn from 'classnames';
import { useEffect, useState } from 'react';
import { Todo } from './../types/Todo';
import { USER_ID } from '../api/todos';

type Props = {
  focusRef: React.RefObject<HTMLInputElement>;
  todos: Todo[];
  postNewTodo: (todoToPost: Todo | null) => void;
  showError(errMessage: string): void;
  todoBeingAdded: boolean;
  clearInput: boolean;
  setClearInput: React.Dispatch<React.SetStateAction<boolean>>;
  toggleTodoCompletedStatus: () => Promise<void>;
  setTogglingIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export const Header: React.FC<Props> = ({
  focusRef,
  todos,
  postNewTodo,
  showError,
  todoBeingAdded,
  clearInput,
  setClearInput,
  toggleTodoCompletedStatus,
  setTogglingIds,
}) => {
  const [inputValue, setInputValue] = useState('');

  const getToggling = () => {
    const currentToggle = todos.some(toDo => !toDo.completed);

    return todos
      .filter(toDo => toDo.completed !== currentToggle)
      .map(toDo => toDo.id);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedValue = inputValue.trim();

    if (trimmedValue) {
      postNewTodo({
        id: Math.floor(1000000 + Math.random() * 9000000),
        userId: USER_ID,
        title: trimmedValue,
        completed: false,
      });
    } else {
      showError('Title should not be empty');
    }
  };

  const handleToggling = () => {
    toggleTodoCompletedStatus();
    setTogglingIds(getToggling());
  };

  useEffect(() => {
    if (clearInput) {
      setInputValue('');
      setClearInput(false);
    }
  }, [clearInput, setClearInput]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: !todos.some(todo => !todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={() => handleToggling()}
        />
      )}

      <form onSubmit={event => handleSubmit(event)}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={focusRef}
          disabled={todoBeingAdded}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
      </form>
    </header>
  );
};
