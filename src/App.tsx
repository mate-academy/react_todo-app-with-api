/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoApi from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState(Status.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processedId, setProcessedId] = useState<number[]>([]);

  const errorTimer = useRef(0);

  const handleErrorMessage = (message: string) => {
    setErrorMessage(message);

    window.clearTimeout(errorTimer.current);

    errorTimer.current = window.setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    todoApi
      .getTodos()
      .then(setTodos)
      .catch(() => {
        handleErrorMessage('Unable to load todos');
      });
  }, []);

  const filteredTodos = useMemo(() => {
    if (status === Status.all) {
      return todos;
    }

    return todos.filter(todo => {
      return status === Status.completed ? todo.completed : !todo.completed;
    });
  }, [todos, status]);

  function addTodo({ title, userId, completed }: Todo) {
    handleErrorMessage('');
    setTempTodo({ title, userId, completed, id: 0 });

    return todoApi
      .createTodos({ title, userId, completed })
      .then(todoToAdd => {
        setTodos(currentTodos => [...currentTodos, todoToAdd]);
        setTempTodo(null);
      })
      .catch(error => {
        setTempTodo(null);
        handleErrorMessage('Unable to add a todo');
        throw error;
      });
  }

  function deleteTodo(id: number) {
    setProcessedId(ids => [...ids, id]);

    return todoApi
      .deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => handleErrorMessage('Unable to delete a todo'))
      .finally(() => setProcessedId([]));
  }

  function updateTodo(updatedTodo: Todo) {
    setProcessedId(ids => [...ids, updatedTodo.id]);

    return todoApi
      .updateTodo(updatedTodo)
      .then(todo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(curTodo => curTodo.id === todo.id);

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
      })
      .catch(error => {
        handleErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => setProcessedId([]));
  }

  if (!todoApi.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          handleErrorMessage={handleErrorMessage}
          onSubmit={addTodo}
          onUpdate={updateTodo}
          userId={todoApi.USER_ID}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
          processedId={processedId}
        />

        {!!todos.length && (
          <TodoFilter
            setStatus={setStatus}
            status={status}
            todos={todos}
            onDelete={deleteTodo}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={handleErrorMessage}
      />
    </div>
  );
};
