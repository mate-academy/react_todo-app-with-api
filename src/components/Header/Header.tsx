import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { addTodo, toggleTodo, USER_ID } from '../../api/todos';
import { useEffect, useRef, useState } from 'react';
import { ErrorMessage } from '../../types/ErrorMesage';

type Props = {
  todos: Todo[];
  areAllTodosCompleted: boolean;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  allNotCompletedTodos: Todo[];
  setTempTodo: (todo: Todo | null) => void;
  isTodoRenaming: boolean;
  errorMessage: string;
  handleError: (error: string) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  areAllTodosCompleted,
  setTodos,
  allNotCompletedTodos,
  setTempTodo,
  isTodoRenaming,
  errorMessage,
  handleError,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, errorMessage]);

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (todoTitle.trim().length === 0) {
      handleError(ErrorMessage.TitleError);

      return;
    }

    setIsInputDisabled(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: todoTitle,
      completed: false,
    });

    addTodo({ userId: USER_ID, title: todoTitle.trim(), completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTodoTitle('');
      })
      .catch(() => {
        handleError(ErrorMessage.AddTodoError);
      })
      .finally(() => {
        setIsInputDisabled(false);
        setTempTodo(null);
      });
  };

  function handleToggleAllClick() {
    if (!areAllTodosCompleted) {
      Promise.allSettled(
        allNotCompletedTodos.map(todo =>
          toggleTodo({ completed: true }, todo.id),
        ),
      ).then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo => ({
            ...todo,
            completed: true,
          })),
        );
      });
    } else {
      Promise.allSettled(
        todos.map(todo => toggleTodo({ completed: false }, todo.id)),
      ).then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo => ({
            ...todo,
            completed: false,
          })),
        );
      });
    }
  }

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllClick}
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
          ref={inputRef}
          disabled={isInputDisabled || isTodoRenaming}
        />
      </form>
    </header>
  );
};
