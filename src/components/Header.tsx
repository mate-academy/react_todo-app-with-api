import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { addTodo, updateTodo } from '../api/todos';
import { ErrorType } from '../App';

type Props = {
  todos: Todo[];
  completedTodos: number;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setCurrentError: React.Dispatch<React.SetStateAction<ErrorType | ''>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Header: React.FC<Props> = ({
  todos,
  completedTodos,
  setTodos,
  setCurrentError,
  setTempTodo,
  isLoading,
  setIsLoading,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const handleTodoAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle) {
      setCurrentError(ErrorType.EmptyTitle);

      return;
    }

    setIsLoading(true);
    setTempTodo({ id: 0, title: todoTitle, completed: false, userId: 0 });

    addTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTodoTitle('');
      })
      .catch(() => {
        setCurrentError(ErrorType.UnableToAddTodo);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });

    return;
  };

  const handleToggleAll = async () => {
    const newStatus = completedTodos !== todos.length;
    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    setIsLoading(true);

    await Promise.all(
      todosToUpdate.map(todo => {
        return updateTodo(todo.id, { completed: newStatus })
          .then(updated => {
            setTodos(prev =>
              prev.map(t => (t.id === updated.id ? updated : t)),
            );
          })
          .catch(() => {
            setCurrentError(ErrorType.UnableToUpdateTodo);
          });
      }),
    );

    setIsLoading(false);
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.length === completedTodos,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleTodoAdd}>
        <input
          key={isLoading ? 'loading' : 'ready'}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={e => setTodoTitle(e.target.value)}
          autoFocus
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
