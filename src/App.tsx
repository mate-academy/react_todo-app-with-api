/* eslint-disable react/jsx-no-bind */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';

import * as todoService from './api/todos';
import { UserWarning } from './UserWarning';

import { Todo } from './types/Todo';
import { ErrorMessage } from './types/Error';
import { FilterType } from './types/FilterType';

import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoError } from './components/TodoError';

import { USER_ID } from './utils/USER_ID';
import { getVisibleTodos } from './utils/getVisibleTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterType.All);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.None);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processedIds, setProcessedIds] = useState<number[]>([]);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.Load));
  }, []);

  const addTodo = useCallback((
    { title, completed, userId }: Omit<Todo, 'id'>,
  ) => {
    setErrorMessage(ErrorMessage.None);

    setTempTodo({
      id: 0,
      title,
      completed,
      userId,
    });

    return todoService.addTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(last => [...last, newTodo]);
      })
      .catch((error) => {
        setErrorMessage(ErrorMessage.Add);

        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  }, []);

  const deleteTodo = useCallback((todoId: number) => {
    setProcessedIds(prev => [...prev, todoId]);
    setErrorMessage(ErrorMessage.None);

    return todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setTodos(todos);
        setErrorMessage(ErrorMessage.Delete);
        throw new Error();
      })
      .finally(() => setProcessedIds(ids => ids.filter(id => id !== todoId)));
  }, []);

  const updateTodo = useCallback((updatedTodo: Todo) => {
    setProcessedIds(prev => [...prev, updatedTodo.id]);
    setErrorMessage(ErrorMessage.None);

    return todoService.updateTodo(updatedTodo)
      .then(todo => {
        setTodos(current => {
          const newTodos = [...current];
          const index = newTodos.findIndex(td => td.id === updatedTodo.id);

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Update);
        throw new Error();
      })
      .finally(() => {
        setProcessedIds(ids => ids.filter(id => id !== updatedTodo.id));
      });
  }, []);

  const visibleTodos = useMemo(() => {
    return getVisibleTodos(todos, filter);
  }, [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          onAdd={addTodo}
          onUpdate={updateTodo}
          onError={setErrorMessage}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              processings={processedIds}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
            <TodoFilter
              todos={todos}
              filter={filter}
              onFilterChange={setFilter}
              onDelete={deleteTodo}
            />
          </>
        )}
      </div>

      <TodoError
        error={errorMessage}
        onErrorChange={setErrorMessage}
      />
    </div>
  );
};
