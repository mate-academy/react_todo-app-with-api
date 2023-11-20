/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import * as TodoService from './api/todos';
import { UserWarning } from './UserWarning';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoList } from './components/TodoList/TodoList';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

const USER_ID = 11775;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [clearingCompleted, setClearingCompleted] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [deletingTodo, setDeletingTodo] = useState<Todo | undefined>(undefined);
  const [updatingTodo, setUpdatingTodo] = useState<Todo | undefined>(undefined);

  useEffect(() => {
    TodoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case Filter.Active:
          return !todo.completed;

        case Filter.Completed:
          return todo.completed;

        default:
          return true;
      }
    });
  }, [filter, todos]);

  const addTodo = (todoTitle: string, setTodoTitle: (t: string) => void) => {
    const newTodo = {
      userId: USER_ID,
      title: todoTitle.trim(),
      completed: false,
    };

    setTempTodo({ id: 0, ...newTodo });

    setIsDisable(true);

    TodoService.createTodo(newTodo)
      .then(resTodo => {
        setTodos(currentTodos => [...currentTodos, resTodo]);
        setTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisable(false);
      });
  };

  const updateTodo = (updatedTodo: Todo) => {
    setUpdatingTodo(todos.find(t => t.id === updatedTodo.id));

    TodoService.updateTodo(updatedTodo)
      .then(todo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(t => t.id === updatedTodo.id);

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => setUpdatingTodo(undefined));
  };

  const deleteTodo = (id: number) => {
    setDeletingTodo(todos.find(t => t.id === id));

    TodoService.deleteTodo(id)
      .then(() => {
        setTodos((currentTodos: Todo[]) => currentTodos
          .filter(t => t.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => setDeletingTodo(undefined));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          setErrorMessage={setErrorMessage}
          isDisable={isDisable}
          addTodo={addTodo}
          todos={todos}
          updateTodo={updateTodo}
        />

        <TodoList
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          clearingCompleted={clearingCompleted}
          deletingTodo={deletingTodo}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          updatingTodo={updatingTodo}
        />

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            setTodos={setTodos}
            setClearingCompleted={setClearingCompleted}
            filter={filter}
            setFilter={setFilter}
            deleteTodo={deleteTodo}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
