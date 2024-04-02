/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { changeTodo, getTodos } from './api/todos';
import { USER_ID } from './utils/consts';
import { TodoComponent } from './components/TodoComponent/TodoComponent';
import { Filter } from './types/Filter';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';
import { TodoForm } from './components/TodoForm/TodoForm';
import { Footer } from './components/Footer/Footer';
import { TodosContext } from './TodoContext/TodoProvider';
import { TodoError } from './types/errors';
import { prepareTodos } from './utils/prepareTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [allTodosCompleted, setAlltodosCompleted] = useState(true);
  const someActiveTodos = todos.some(todo => !todo.completed);

  const { addTodoForUpdate, removeTodoForUpdate } = useContext(TodosContext);

  const addTodo = (todo: Todo): void => {
    setTodos((prevTodos) => ([...prevTodos, todo]));
  };

  const removeTodo = (todoId: number): void => {
    setTodos(prev => prev.filter(({ id }) => id !== todoId));
  };

  const handleTempTodo = (value: null | Todo):void => {
    setTempTodo(value);
  };

  function setErrorHide():void {
    if (errorMessage) {
      setErrorMessage('');
    }
  }

  function updateTodo(updatedTodo: Partial<Todo>): void {
    setTodos(prevTodos => {
      const copy = [...prevTodos];
      const prevTodoIndex = copy.findIndex(todo => todo.id === updatedTodo.id);
      const changedTodo: Todo = { ...copy[prevTodoIndex], ...updatedTodo };

      copy[prevTodoIndex] = changedTodo;

      return copy;
    });
  }

  const setAllCompleted = () => {
    let todosForUpdate = todos.filter(
      todo => todo.completed !== allTodosCompleted,
    );

    let completedValue = allTodosCompleted;

    if (todos.every(todo => todo.completed === allTodosCompleted)) {
      todosForUpdate = [...todos];
      completedValue = !allTodosCompleted;
    }

    todosForUpdate.forEach(
      todo => {
        const updatedTodo: Todo = {
          ...todo,
          completed: completedValue,
        };

        addTodoForUpdate(updatedTodo);

        changeTodo(updatedTodo)
          .then(updateTodo)
          .catch(() => {
            setErrorMessage(TodoError.TodoUpdate);
          })
          .finally(() => removeTodoForUpdate(updatedTodo));
      },
    );
    setAlltodosCompleted(!allTodosCompleted);
  };

  const preparedTodos = prepareTodos(todos, filter);

  useEffect(() => {
    getTodos(USER_ID)
      .then((todosServer) => {
        setTodos(todosServer);
      })
      .catch(() => {
        setErrorMessage(TodoError.Load);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: !someActiveTodos,
              })}
              data-cy="ToggleAllButton"
              onClick={() => setAllCompleted()}
            />
          )}

          <TodoForm
            setError={setErrorMessage}
            addTodo={addTodo}
            handleTempTodo={handleTempTodo}
            todos={todos}
          />
        </header>

        {!!todos && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {preparedTodos?.map(todo => (
                <TodoComponent
                  todo={todo}
                  key={todo.id}
                  onDelete={removeTodo}
                  onError={setErrorMessage}
                  onUpdate={updateTodo}
                />
              ))}
            </section>
            {!!tempTodo && (
              <TodoComponent
                todo={tempTodo}
                onDelete={removeTodo}
                onError={setErrorMessage}
                onUpdate={updateTodo}
              />
            )}

            {todos.length > 0 && (
              <Footer
                filter={filter}
                todos={todos}
                onFilter={setFilter}
                onRemove={removeTodo}
                onError={setErrorMessage}
              />
            )}
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorHide={setErrorHide}
      />
    </div>
  );
};
