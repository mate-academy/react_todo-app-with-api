/* eslint-disable react-hooks/exhaustive-deps */
import { USER_ID } from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorMessage } from '../types/ErrorMessage';
import { useEffect, useRef } from 'react';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  visibleTodos: Todo[];
  title: string;
  setTitle: (title: string) => void;
  addTodo: ({ title, completed, userId }: Omit<Todo, 'id'>) => void;
  errorMessage: ErrorMessage;
  setErrorMessage: (errorMessage: ErrorMessage) => void;
  receiving: boolean;
  setUpdatingAndDeletingCompletedTodos: (
    deletingCompletedTodos: Todo[] | [],
  ) => void;
  changeTodo: (todo: Todo) => void;
  editingTitle: number;
};

export const Header: React.FC<Props> = ({
  todos,
  visibleTodos,
  title,
  setTitle,
  addTodo,
  errorMessage,
  setErrorMessage,
  receiving,
  setUpdatingAndDeletingCompletedTodos,
  changeTodo,
  editingTitle,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current && !editingTitle) {
      titleField.current.focus();
    }
  }, [visibleTodos]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    addTodo({ title: title.trim(), completed: false, userId: USER_ID });
  }

  const allTodosCompleted = visibleTodos.every(todo => todo.completed);

  function toggleAllTodos() {
    if (allTodosCompleted) {
      setUpdatingAndDeletingCompletedTodos(visibleTodos);

      visibleTodos.forEach(todo => {
        changeTodo({ ...todo, completed: !todo.completed });
      });

      return;
    }

    const notCompletedTodos = visibleTodos.filter(todo => !todo.completed);

    setUpdatingAndDeletingCompletedTodos(notCompletedTodos);

    notCompletedTodos.forEach(todo => {
      changeTodo({ ...todo, completed: !todo.completed });
    });
  }

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => {
            setTitle(event.target.value);
            setErrorMessage({ ...errorMessage, emptyTitle: false });
          }}
          ref={titleField}
          disabled={receiving}
        />
      </form>
    </header>
  );
};
