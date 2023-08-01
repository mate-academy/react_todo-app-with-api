import React, { useState } from 'react';
import cn from 'classnames';
import { Error, Todo } from '../types/Todo';
import * as todosService from '../api/todos';

type Props = {
  todos: Todo[],
  setTodos: (value: Todo[]) => void,
  tempTodo: Todo | null,
  setTempTodo: (value: null | Todo) => void,
  setHasError: (value: Error) => void,
  setLoading: (value: boolean) => void,
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  setTodos,
  tempTodo,
  setTempTodo,
  setHasError,
  setLoading,
}) => {
  const [title, setTitle] = useState('');

  const USER_ID = 11041;
  const isAllTodosActive = todos.every(todo => todo.completed);

  const toggleAllTodos = () => {
    setLoading(true);
    todos.forEach(todo => {
      if (todo.completed !== isAllTodosActive) {
        return;
      }

      todosService.updateTodo(todo.id, { completed: !isAllTodosActive })
        .then(() => {
          setTodos(todos.map(t => ({
            ...t,
            completed: !isAllTodosActive,
          })));
        })
        .catch(() => {
          setHasError(Error.UPDATE);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const handleTodoAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (title.trim() === '') {
      setHasError(Error.EMPTY);

      return;
    }

    setTempTodo({
      userId: USER_ID,
      title: title.trim(),
      completed: false,
      id: 0,
    });

    todosService.addTodos({
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    }).then(newTodo => {
      setTodos([...todos, newTodo]);
    }).catch(() => setHasError(Error.ADD))
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });

    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        /* eslint-disable-next-line */
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllTodosActive,
          })}
          onClick={toggleAllTodos}
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
