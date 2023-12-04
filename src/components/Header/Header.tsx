import { useRef, useEffect, useContext } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorNotification } from '../../types/ErrorNotification';
import { TodosContext } from '../../TodosContext';
import { updateTodo } from '../../api/todos';

/* eslint-disable jsx-a11y/control-has-associated-label */
interface Props {
  onAdd: (todo: Omit<Todo, 'id'>) => void;
  userId: number;
  setErrorMessage: (q: ErrorNotification) => void;
}

export const Header: React.FC<Props> = ({
  onAdd, userId, setErrorMessage,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    todos,
    setTodos,
    title,
    setTitle,
    isInputDisabled,
  } = useContext(TodosContext);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputDisabled]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle) {
      const newTodo = {
        title: trimmedTitle,
        userId,
        completed: false,
      };

      onAdd(newTodo);
    } else {
      setErrorMessage(ErrorNotification.TitleError);
    }
  };

  const handleToggleAll = () => {
    const hasCompleted = todos.some(item => !item.completed);

    const updatedTodos = todos.map(item => ({
      ...item,
      completed: hasCompleted,
    }));

    updatedTodos.map(item => updateTodo(item));

    setTodos(updatedTodos);
  };

  const isEveryCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isEveryCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isInputDisabled}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
