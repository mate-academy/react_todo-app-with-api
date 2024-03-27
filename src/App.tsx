/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';

import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { TodoList } from './components/TodoList';
import { NotificationHandler } from './components/NotificationHandler';
import { getFilteredTodos } from './services/filteredTodos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { wait } from './utils/fetchClient';
import { TodoError } from './types/TodoError';

export const App: React.FC = () => {
  const { DEFAULT, CREATE, READ, UPDATE, DELETE } = TodoError;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.ALL);
  const [errorMessage, setErrorMessage] = useState<TodoError>(DEFAULT);
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processedId, setProcessedId] = useState(0);

  useEffect(() => {
    wait(3000).then(() => setErrorMessage(DEFAULT));
  }, [errorMessage, DEFAULT]);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(READ));
  }, [READ]);

  const handleError = (todoError: TodoError, error: Error) => {
    setErrorMessage(todoError);
    throw error;
  };

  const initPreRequest = () => {
    setErrorMessage(DEFAULT);
    setLoading(true);
  };

  const handlePostSubmit = () => {
    setLoading(false);
    setTempTodo(null);
  };

  const createTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
    initPreRequest();
    setTempTodo({
      id: 0,
      title,
      completed,
      userId,
    });

    return todoService
      .createTodo({ title, completed, userId })
      .then(newTodo => setTodos(currentTodos => [...currentTodos, newTodo]))
      .catch(error => handleError(CREATE, error))
      .finally(handlePostSubmit);
  };

  const handleTodoListPostProcess = () => {
    setLoading(false);
    setProcessedId(0);
  };

  const updateTodo = (updatedTodo: Todo) => {
    initPreRequest();
    setProcessedId(updatedTodo.id);

    return todoService
      .updateTodo(updatedTodo)
      .then(newTodo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(({ id }) => id === updatedTodo.id);

          newTodos.splice(index, 1, newTodo);

          return newTodos;
        });
      })
      .catch(error => handleError(UPDATE, error))
      .finally(handleTodoListPostProcess);
  };

  const deleteTodo = (todoId: number) => {
    initPreRequest();
    setProcessedId(todoId);

    todoService
      .deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(({ id }) => id !== todoId),
        ),
      )
      .catch(error => handleError(DELETE, error))
      .finally(handleTodoListPostProcess);
  };

  const filteredTodos = getFilteredTodos(todos, filter);
  const hasEveryCompletedTodo = todos.every(({ completed }) => completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasEveryCompletedTodo={hasEveryCompletedTodo}
          onSubmit={createTodo}
          setErrorMessage={setErrorMessage}
          loading={loading}
          todos={todos}
          onUpdate={updateTodo}
        />

        <TodoList
          todos={filteredTodos}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
          processedId={processedId}
          tempTodo={tempTodo}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            currentFilter={filter}
            setFilter={setFilter}
            onDelete={deleteTodo}
          />
        )}
      </div>

      <NotificationHandler errorMessage={errorMessage} />
    </div>
  );
};
