import cn from 'classnames';
import {
  useContext,
  useEffect,
  useRef,
} from 'react';
import { ErrorType } from '../../types/ErrorType';
import { AppContext } from '../../contexts/appContext';

interface Props {
  isEveryTodosCompleted: boolean,
}

export const Header: React.FC<Props> = ({ isEveryTodosCompleted }) => {
  const {
    todoTitle,
    setTodoTitle,
    createNewTodo,
    isLoading,
    displayError,
    todosFromServer,
    setTodosFromServer,
  } = useContext(AppContext);

  const todoTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoTitleRef.current && !todoTitleRef.current.disabled) {
      todoTitleRef.current.focus();
    }
  });

  const handleToggleAllChange = () => {
    const areAllCompleted = todosFromServer.every(todo => todo.completed);

    setTodosFromServer(todosFromServer.map(todo => ({
      ...todo,
      completed: !areAllCompleted,
    })));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!todoTitle.trim()) {
      displayError(ErrorType.TitleIsEmpty);

      return;
    }

    createNewTodo(todoTitle.trim());
  };

  return (
    <header className="todoapp__header">
      {!isLoading && todosFromServer.length > 0 && (
        <button
          aria-label="Toggle All"
          type="button"
          className={cn(
            'todoapp__toggle-all',
            { active: isEveryTodosCompleted },
          )}
          onClick={handleToggleAllChange}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
          ref={todoTitleRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
