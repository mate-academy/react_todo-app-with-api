/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoNotification } from './components/TodoNotification';
import { Error, Filter, Todo } from './types/Todo';
import * as todosService from './api/todos';

export const USER_ID = 11041;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(Error.NOTHING);
  const [filterTodos, setFilterTodos] = useState(Filter.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const filteredTodos = useMemo(() => {
    switch (filterTodos) {
      case Filter.COMPLETED:
        return todos.filter(todo => todo.completed);
      case Filter.ACTIVE:
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  }, [filterTodos, todos]);

  const deleteCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const uncompletedTodos = todos.filter(todo => !todo.completed);

    setLoadingIds(completedTodos.map(todo => todo.id));

    await Promise.all(completedTodos.map(async (todo) => {
      try {
        await todosService.deleteTodos(todo.id);
      } catch (error) {
        setHasError(Error.DELETE);
        throw error;
      }
    }));
    setLoadingIds([]);
    setTodos(uncompletedTodos);
  };

  useEffect(() => {
    todosService.getTodos(USER_ID)
      .then((data) => setTodos(data))
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
          todos={todos}
          setTodos={setTodos}
          isTempTodoExist={!!tempTodo}
          setTempTodo={setTempTodo}
          setHasError={setHasError}
        />
        <TodoList
          loadingIds={loadingIds}
          setLoadingIds={setLoadingIds}
          setTodos={setTodos}
          tempTodo={tempTodo}
          setHasError={setHasError}
          filteredTodos={filteredTodos}
        />

        {todos.length !== 0 && (
          <TodoFooter
            todos={todos}
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
