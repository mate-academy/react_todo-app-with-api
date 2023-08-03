/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoNotification } from './components/TodoNotification';
import { Error, Filter, Todo } from './types/Index';
import * as todosService from './api/todos';

const USER_ID = 10818;

export const App: React.FC = () => {
  const [todo, setTodo] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(Error.NOTHING);
  const [filterTodos, setFilterTodos] = useState(Filter.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const filteredTodos = useMemo(() => {
    switch (filterTodos) {
      case Filter.COMPLETED:
        return todo.filter(todos => todos.completed);
      case Filter.ACTIVE:
        return todo.filter(todos => !todos.completed);
      default:
        return todo;
    }
  }, [filterTodos, todo]);

  const deleteCompletedTodos = async () => {
    const completedTodos = todo.filter(todos => todos.completed);
    const uncompletedTodos = todo.filter(todos => !todos.completed);

    setLoadingIds(completedTodos.map(todos => todos.id));

    await Promise.all(completedTodos.map(async (todos) => {
      try {
        await todosService.deleteTodos(todos.id);
      } catch (error) {
        setHasError(Error.DELETE);
        throw error;
      }
    }));
    setLoadingIds([]);
    setTodo(uncompletedTodos);
  };

  useEffect(() => {
    todosService.getTodos(USER_ID)
      .then((data) => setTodo(data))
      .catch(() => setHasError(Error.FETCH));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          loadingIds={loadingIds}
          setLoadingIds={setLoadingIds}
          todos={todo}
          setTodos={setTodo}
          tempTodo={tempTodo}
          setTempTodo={setTempTodo}
          setHasError={setHasError}
        />
        <TodoList
          loadingIds={loadingIds}
          setLoadingIds={setLoadingIds}
          todos={todo}
          setTodos={setTodo}
          tempTodo={tempTodo}
          setHasError={setHasError}
          filteredTodos={filteredTodos}
        />

        {todo.length !== 0 && (
          <TodoFooter
            todos={todo}
            filterTodos={filterTodos}
            setFilterTodos={setFilterTodos}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      {hasError !== Error.NOTHING && (
        <TodoNotification
          hasError={hasError}
          setHasError={setHasError}
        />
      )}
    </div>
  );
};
