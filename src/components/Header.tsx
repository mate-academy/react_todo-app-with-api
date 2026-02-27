import React from 'react';
import { ErrorMessage } from '../types/enums';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface Props {
  USER_ID: number;
  addTodo: (title: string) => Promise<Todo>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setShowError: React.Dispatch<React.SetStateAction<'' | ErrorMessage>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  todoFieldRef: React.RefObject<HTMLInputElement>;
  handleToggleAll: () => void;
  todos: Todo[];
}

export const Header: React.FC<Props> = ({
  USER_ID,
  addTodo,
  setTodos,
  setShowError,
  setTempTodo,
  todoFieldRef,
  handleToggleAll,
  todos,
}) => {
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const input = todoFieldRef.current;

    if (!input) {
      return;
    }

    const title = input.value.trim();

    if (title) {
      const newTempTodo: Todo = {
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      };

      addTodo(title)
        .then(newTodo => {
          setTodos(prevTodos => [...prevTodos, newTodo]);
          input.value = '';
        })
        .catch(() => {
          setShowError(ErrorMessage.Add);
        })
        .finally(() => {
          setTempTodo(null);
          input.disabled = false;
          input.focus();
        });

      setTempTodo(newTempTodo);
      input.disabled = true;
    } else {
      setShowError(ErrorMessage.EmptyTitle);
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.length > 0 && todos.every(todo => todo.completed),
          })}
          onClick={handleToggleAll}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          ref={todoFieldRef}
          data-cy="NewTodoField"
          type="text"
          name="newTodo"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
        />
      </form>
    </header>
  );
};
