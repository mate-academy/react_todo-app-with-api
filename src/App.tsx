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
  const [isDisable, setIsDisable] = useState(false);
  const [todosIdsAreLoading, setTodosIdsAreLoading] = useState<number[]>([0]);

  const errorNotification = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    TodoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        errorNotification('Unable to load todos');
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
        errorNotification('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisable(false);
      });
  };

  const updateTodo = (updatedTodo: Todo) => {
    setTodosIdsAreLoading(currentIds => [...currentIds, updatedTodo.id]);

    setTodos(currentTodos => {
      const newTodos = [...currentTodos];
      const index = newTodos.findIndex(t => t.id === updatedTodo.id);

      newTodos.splice(index, 1, updatedTodo);

      return newTodos;
    });

    TodoService.updateTodo(updatedTodo)
      .then()
      .catch(() => {
        errorNotification('Unable to update a todo');
      })
      .finally(() => {
        setTodosIdsAreLoading(ids => ids.filter(id => id !== updatedTodo.id));
      });
  };

  const deleteTodo = (id: number) => {
    setTodosIdsAreLoading(currentIds => [...currentIds, id]);

    TodoService.deleteTodo(id)
      .then(() => {
        setTodos((currentTodos: Todo[]) => currentTodos
          .filter(t => t.id !== id));
      })
      .catch(() => {
        errorNotification('Unable to delete a todo');
      })
      .finally(() => {
        setTodosIdsAreLoading(ids => ids.filter(todoId => todoId !== id));
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          errorNotification={errorNotification}
          isDisable={isDisable}
          addTodo={addTodo}
          todos={todos}
          updateTodo={updateTodo}
        />

        <TodoList
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          todosIdsAreLoading={todosIdsAreLoading}
        />

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            setTodos={setTodos}
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
