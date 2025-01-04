/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoFooter } from './Components/Footer';
import { TodoHeader } from './Components/Header';
import { TodoMain } from './Components/Main';
import { ErrorNotifications } from './Components/Errors';
import { Filter } from './types/Filter';
import { Errors } from './types/Errors';
import { filterTodos } from './Components/FilterFunc/FilterTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.All);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [processing, setProcessing] = useState<number | null>(null);
  const [todosQuantity, setTodosQuantity] = useState(0);
  const [isEditing, setIsEditing] = useState<number | null>(null);

  const AddTodo = useCallback(
    (newTodo: Todo) => {
      setErrorMessage(null);
      setProcessing(0);
      setTodos(currentTodos => [...currentTodos, newTodo]);

      return todoService
        .createTodo(newTodo)
        .then(todo => setTodos(currentTodos => [...currentTodos, todo]))
        .then(() =>
          setTodos(currentTodos => {
            currentTodos.splice(currentTodos.length - 2, 1);

            if (!newTodo.completed) {
              setTodosQuantity(todosQuantity + 1);
            }

            return currentTodos;
          }),
        )
        .catch(error => {
          setErrorMessage(Errors.Add);
          setTodos(currentTodos => {
            currentTodos.splice(currentTodos.length - 1, 1);

            return currentTodos;
          });
          throw error;
        })
        .finally(() => setProcessing(null));
    },
    [todosQuantity],
  );

  const DeleteTodo = useCallback(
    (todoId: number) => {
      setErrorMessage(null);
      setProcessing(todoId);

      return todoService
        .deleteTodo(todoId)
        .then(() =>
          setTodos(currentTodos => {
            const foundedTodo = currentTodos.find(todo => todoId === todo.id);

            if (!foundedTodo?.completed) {
              setTodosQuantity(todosQuantity - 1);
            }

            return currentTodos.filter(todo => todo.id !== todoId);
          }),
        )
        .catch(error => {
          setErrorMessage(Errors.Delete);
          throw error;
        })
        .finally(() => setProcessing(null));
    },
    [todosQuantity],
  );

  const redactTodo = useCallback((redactedTodo: Todo) => {
    setProcessing(redactedTodo.id);

    return todoService
      .redactTodo(redactedTodo)
      .then(updatedTodo =>
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(todo => todo.id === redactedTodo.id);

          newTodos.splice(index, 1, updatedTodo);

          return newTodos;
        }),
      )
      .catch(error => {
        setErrorMessage(Errors.Redact);
        throw error;
      })
      .finally(() => setProcessing(null));
  }, []);

  const viewedTodos = useMemo(
    () => filterTodos(todos, filter),
    [todos, filter],
  );

  useEffect(() => {
    setErrorMessage(null);

    todoService
      .getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
        setTodosQuantity(
          todosFromServer.filter(todo => !todo.completed).length,
        );
      })
      .catch(error => {
        setErrorMessage(Errors.Upload);
        throw error;
      });
  }, []);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          onAdd={AddTodo}
          onUpdate={redactTodo}
          setError={setErrorMessage}
          processing={processing}
          setTodosQuantity={setTodosQuantity}
          isEditing={isEditing}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {viewedTodos.map(todo => (
            <TodoMain
              todo={todo}
              processing={processing}
              onUpdate={redactTodo}
              onDelete={DeleteTodo}
              key={todo.id}
              todosQuantity={todosQuantity}
              setTodosQuantity={setTodosQuantity}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          ))}
        </section>

        {todos.length !== 0 && (
          <TodoFooter
            todosQuantity={todosQuantity}
            filter={filter}
            setFilter={setFilter}
            todos={todos}
            onDelete={DeleteTodo}
          />
        )}
      </div>

      <ErrorNotifications error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};
