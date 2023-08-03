import React, { useState } from 'react';
import classnames from 'classnames';
import { Error, Todo } from '../types/Index';
import * as todosService from '../api/todos';

type Props = {
  todos: Todo[],
  setTodos: (value: Todo[]) => void,
  tempTodo: Todo | null,
  setTempTodo: (value: null | Todo) => void,
  setHasError: (value: Error) => void,
  loadingIds: number[],
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>,
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  setTodos,
  tempTodo,
  setTempTodo,
  setHasError,
  loadingIds,
  setLoadingIds,
}) => {
  const [title, setTitle] = useState('');

  const USER_ID = 11041;
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

  const handleTodoAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim() === '') {
      setHasError(Error.EMPTY);

      return;
    }

    const todoToCreate = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
      id: 0,
    };

    setLoadingIds([todoToCreate.id, ...loadingIds]);
    setTempTodo(todoToCreate);

    todosService.addTodos({
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    }).then(newTodo => {
      setTodos([...todos, newTodo]);
      setTitle('');
    }).catch((error) => {
      setHasError(Error.ADD);
      throw error;
    })
      .finally(() => {
        setLoadingIds((ids) => {
          return ids.filter(id => id !== todoToCreate.id);
        });
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        /* eslint-disable-next-line */
        <button
          type="button"
          className={classnames('todoapp__toggle-all', {
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
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
