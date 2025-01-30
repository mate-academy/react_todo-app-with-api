/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoServises from './api/todos';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';

import { Todo } from './types/Todo';
import { TodoFilter } from './types/Filter';

import cn from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.all);
  const [inputValue, setInputValue] = useState('');
  const [tempoTodo, setTempoTodo] = useState<Todo | null>(null);
  const [todoDelete, setTodoDelete] = useState<number[]>([]);
  const [toggleLoader, setToggleLoader] = useState(false);
  const [pageLoad, setPageLoad] = useState(false);

  const filteredTodo = todos.filter(todo => {
    if (filter === TodoFilter.active) {
      return !todo.completed;
    }

    if (filter === TodoFilter.completed) {
      return todo.completed;
    }

    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;
  const summTodo = activeCount + completedCount;

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    setPageLoad(true);
    todoServises
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      })
      .finally(() => {
        setPageLoad(false);
      });

    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!todoServises.USER_ID) {
    return <UserWarning />;
  }

  const addTodo = async (
    title: string,
    userId: number,
    completed: boolean = false,
  ): Promise<void> => {
    const newTempoTodo: Todo = {
      id: 0,
      title: inputValue.trim(),
      userId: todoServises.USER_ID,
      completed: false,
    };

    setTempoTodo(newTempoTodo);

    try {
      const newTodo = await todoServises.addTodos({ title, userId, completed });

      setTodos(currentTodo => [...currentTodo, newTodo]);
    } catch {
      setError('Unable to add a todo');

      throw Error('Unable to add a todo');
    } finally {
      setTempoTodo(null);
    }
  };

  const deleteTodo = async (todoId: number) => {
    setTodoDelete(prevTodos => [...prevTodos, todoId]);

    return todoServises
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setTodoDelete(prevTodos =>
          prevTodos.filter(prevTodo => prevTodo !== todoId),
        );
      });
  };

  const handleDeleteCompledTodo = async () => {
    const completedTodo = todos.filter(todo => todo.completed);

    if (completedTodo.length === 0) {
      return;
    }

    await Promise.allSettled(completedTodo.map(todo => deleteTodo(todo.id)));
  };

  const updateTodo = async (updatedTodo: Todo) => {
    try {
      const updated = await todoServises.updateTodos(updatedTodo);

      if (!updated) {
        throw Error('Unable to update a todo');
      }

      setTodos(currentTodo =>
        currentTodo.map(todo => (todo.id === updated.id ? updated : todo)),
      );
    } catch {
      setError('Unable to update a todo');
      throw new Error('Unable to update a todo');
    }

    return;
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputValue={inputValue}
          setInputValue={setInputValue}
          addTodo={addTodo}
          setError={setError}
          filteredTodo={filteredTodo}
          todoDelete={todoDelete}
          updateTodo={updateTodo}
          setToggleLoader={setToggleLoader}
          pageLoad={pageLoad}
          summTodo={summTodo}
        />

        <TodoList
          filteredTodo={filteredTodo}
          deleteTodo={deleteTodo}
          tempoTodo={tempoTodo}
          todoDelete={todoDelete}
          updateTodo={updateTodo}
          toggleLoader={toggleLoader}
        />

        {todos.length > 0 && (
          <Footer
            currentFilter={filter}
            activeCount={activeCount}
            completedCount={completedCount}
            onFilterChange={setFilter}
            onClearCompleted={handleDeleteCompledTodo}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </div>
  );
};
