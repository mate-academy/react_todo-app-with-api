/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoFilter } from './types/TodoFilter';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import * as todoServices from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosInProcess, setTodosInProcess] = useState<number[]>([0]);

  // #region loadTodos
  const loadTodos = async () => {
    try {
      const loadedTodos = await getTodos();

      setTodos(loadedTodos);
    } catch {
      setError('Unable to load todos');
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (error !== '') {
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  }, [error]);

  // #endregion

  // #region filter
  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case TodoFilter.Active:
        return !todo.completed;
      case TodoFilter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  // #endregion
  // #region todoServices
  const addTodo = async (newTodo: Todo) => {
    try {
      const addedTodo = await todoServices.addTodo(newTodo);

      setTodos(prevTodos => [...prevTodos].concat(addedTodo));
    } finally {
      setTempTodo(null);
    }
  };

  const deleteTodo = async (id: number | number[]) => {
    const ids = Array.isArray(id) ? id : [id];

    setTodosInProcess(currentTodo => [...currentTodo, ...ids]);

    try {
      const results = await Promise.all(
        ids.map(async i => {
          try {
            await todoServices.deleteTodo(i);

            return i;
          } catch {
            setError('Unable to delete a todo');

            return null;
          }
        }),
      );

      const successDelete = results.filter(result => result !== null);

      setTodos(todos.filter(todo => !successDelete.includes(todo.id)));
    } finally {
      setTodosInProcess(currentId => currentId.filter(i => !ids.includes(i)));
    }
  };

  const updateTodo = async (updatedTodo: Todo | Todo[]) => {
    const ids = Array.isArray(updatedTodo)
      ? updatedTodo.map(todo => todo.id)
      : [updatedTodo.id];

    setTodosInProcess(currentTodo => [...currentTodo, ...ids]);

    const handleUpdatedTodo = async (todo: Omit<Todo, 'userId'>) => {
      return todoServices.updatedTodo(todo);
    };

    try {
      let updatedTodos: Todo[] = [];

      if (Array.isArray(updatedTodo)) {
        const updatePromises = updatedTodo.map(todo => handleUpdatedTodo(todo));
        const results = await Promise.allSettled(updatePromises);

        updatedTodos = results
          .filter(
            (result): result is PromiseFulfilledResult<Todo> =>
              result.status === 'fulfilled',
          )
          .map(result => result.value);
      } else {
        const updated = await handleUpdatedTodo(updatedTodo);

        updatedTodos = updated ? [updated] : [];
      }

      setTodos(prevTodos =>
        prevTodos.map(prevTodo => {
          const updatedTodoItem = updatedTodos.find(
            todo => prevTodo.id === todo.id,
          );

          return updatedTodoItem ? updatedTodoItem : prevTodo;
        }),
      );
    } catch {
      setError('Unable to update a todo');
    } finally {
      setTodosInProcess(currentId => currentId.filter(id => !ids.includes(id)));
    }
  };

  // #endregion

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          onError={setError}
          onTempTodo={setTempTodo}
          onAdd={addTodo}
          onUpdate={updateTodo}
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            todosInProcess={todosInProcess}
            onUpdate={updateTodo}
            onDelete={deleteTodo}
          />
        )}

        {(todos.length > 0 || tempTodo) && (
          <TodoFooter
            todos={todos}
            filter={filter}
            onFilter={setFilter}
            onDelete={deleteTodo}
          />
        )}
      </div>

      <ErrorNotification error={error} onError={setError} />
    </div>
  );
};
