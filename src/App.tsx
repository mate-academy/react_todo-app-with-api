import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { HeaderTodoApp } from './components/HeaderTodoApp';
import { MainTodoApp } from './components/MainTodoApp';
import {
  addTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { FooterTodoApp } from './components/FooterTodoApp';
import { Filter } from './types/Filter';
import { ErrorComponent } from './components/ErrorComponent';
import { USER_ID } from './userId';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [category, setCategory] = useState(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState('');
  const [loadingTodosId, setLoadingTdodoId] = useState<number[]>([]);

  const loadTodos = useCallback(async () => {
    const todosFromServer = await getTodos(USER_ID);

    setTodos(todosFromServer);
    setTempTodo(null);
    setLoadingTdodoId([]);
  }, []);

  const visibleTodos = useMemo(() => todos.filter(({ completed }) => {
    switch (category) {
      case Filter.Completed:
        return completed;
      case Filter.Active:
        return !completed;
      default:
        return true;
    }
  }), [todos, category]);

  const createTodo = useCallback(async (todoData: Todo) => {
    try {
      setTempTodo(todoData);
      await addTodo(todoData);
    } catch {
      setError('Unable to add a todo');
      setTempTodo(null);
    }

    loadTodos();
  }, []);

  const removeTodo = useCallback(async (todoData: Todo) => {
    try {
      setLoadingTdodoId((prevTodosId) => [...prevTodosId, todoData.id]);
      await deleteTodo(todoData.id);
    } catch {
      setError('Unable to delete a todo');
      setLoadingTdodoId([]);
    }

    loadTodos();
  }, []);

  const changeTodo = useCallback(async (
    todo: Todo,
    changeValue: boolean | string,
  ) => {
    try {
      setLoadingTdodoId((prevTodosId) => [...prevTodosId, todo.id]);
      await updateTodo(todo.id, changeValue);
    } catch {
      setError('Unable to update a todo');
      setLoadingTdodoId([]);
    }

    loadTodos();
  }, []);

  const deleteCompletedTodo = () => {
    todos
      .forEach(todo => {
        if (todo.completed === true) {
          removeTodo(todo);
        }
      });
  };

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <HeaderTodoApp
          todos={todos}
          onCreate={createTodo}
          tempTodo={tempTodo}
          onError={setError}
          onChangeTodo={changeTodo}
        />

        <MainTodoApp
          todos={visibleTodos}
          onRemove={removeTodo}
          tempTodo={tempTodo}
          onChangeTodo={changeTodo}
          loadingTodosId={loadingTodosId}
        />

        {todos.length > 0 && (
          <FooterTodoApp
            todos={todos}
            category={category}
            onChange={setCategory}
            onDelete={deleteCompletedTodo}
          />
        )}
      </div>

      {error && (
        <ErrorComponent error={error} onError={setError} />
      )}
    </div>
  );
};
