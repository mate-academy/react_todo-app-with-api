import React, { useState } from 'react';
import cn from 'classnames';
import { Error, Todo } from '../types/Todo';
import * as todosService from '../api/todos';

type Props = {
  todos: Todo[],
  setTodos: (value: Todo[]) => void,
  isTempTodoExist: boolean,
  setHasError: (value: Error) => void,
  loadingIds: number[],
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>,
  addTodo: (title: string) => Promise<void>
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  setTodos,
  isTempTodoExist,
  setHasError,
  loadingIds,
  setLoadingIds,
  addTodo,
}) => {
  const [title, setTitle] = useState('');

  const neededStatus = !todos.every(todo => todo.completed);

  const toggleAllTodos = async () => {
    const arrayTodoToUpdate = todos.filter(todo => {
      if (todo.completed === neededStatus) {
        return false;
      }

      return true;
    });

    setLoadingIds(arrayTodoToUpdate.map(i => i.id));

    await Promise.all(arrayTodoToUpdate.map(async (todo) => {
      try {
        await todosService.updateTodo(todo.id, { completed: neededStatus });
        setTodos(todos.map(t => ({
          ...t,
          completed: neededStatus,
        })));
      } catch (err) {
        setHasError(Error.UPDATE);
      }
    }));

    setLoadingIds([]);
  };

  const handleTodoAdd = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim() === '') {
      setHasError(Error.EMPTY);

      return;
    }

    await addTodo(title);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        /* eslint-disable-next-line */
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: !neededStatus,
          })}
          onClick={toggleAllTodos}
          disabled={loadingIds.length > 0}
        />
      )}

      <form onSubmit={handleTodoAdd}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isTempTodoExist}
        />
      </form>
    </header>
  );
};
