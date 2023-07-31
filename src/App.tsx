/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import { AppList } from './components/TodoList';
import { Footer } from './components/Footer';
import { AddForm } from './components/AddForm';
import {
  createTodo, deleteTodo, getTodos, updateTodo,
} from './services/todos';
import { ErrorType } from './types/Error';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Notifications } from './components/Notifications';
import { getPreparedTodos } from './services/PrepepareTodos';

export const USER_ID = 11223;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletedTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChansingStatus, setIsChangingStatus] = useState(false);
  const [isUpdatingId, setIsUpdatingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    getTodos(USER_ID)
      .then((data) => {
        setTodos(data);
      })
      .catch(() => {
        setErrorMessage(ErrorType.fetchTodo);
      });
  }, []);

  const filteredTodos = useMemo(() => getPreparedTodos(
    todos,
    filter,
  ), [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = (newTitle: string) => {
    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: newTitle,
      completed: false,
    };

    setIsLoading(true);

    return createTodo(newTodo)
      .then((createdTodo) => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setErrorMessage('');
        setIsLoading(false);
      })
      .catch(() => {
        setErrorMessage(ErrorType.addTodo);
        setIsLoading(false);
      });
  };

  const removeTodo = (todoId: number) => {
    setDeletingTodoId(todoId);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
        setErrorMessage('');
      })
      .catch(() => {
        setErrorMessage(ErrorType.deleteTodo);
      })
      .finally(() => {
        setDeletingTodoId(null);
      });
  };

  const changeTodo = (todoId: number, todoTitle?: string) => {
    setIsUpdatingId(todoId);

    const updatingTodo = todos.find(todo => todo.id === todoId);
    let newTodo;

    if (updatingTodo && todoTitle) {
      newTodo = {
        ...updatingTodo,
        title: todoTitle,
      };
    }

    if (updatingTodo && !todoTitle) {
      newTodo = {
        ...updatingTodo,
        completed: !updatingTodo.completed,
      };
    }

    return updateTodo(newTodo as Todo)
      .then(todo => {
        setTodos(currentTodos => {
          const newTodos: Todo[] = [...currentTodos];
          const index = newTodos.findIndex(editTodo => editTodo.id === todoId);

          newTodos.splice(index, 1, todo as Todo);

          return newTodos;
        });

        setErrorMessage('');
        setIsUpdatingId(null);
      })
      .catch(() => {
        setErrorMessage(ErrorType.updateTodo);
      })
      .finally(() => {
        setIsUpdatingId(null);
      });
  };

  const handleCompliteAll = () => {
    setIsChangingStatus(true);
    let changingTodos: Todo[] = [];

    if (todos.some(todo => todo.completed === false)) {
      changingTodos = todos
        .filter(todo => todo.completed === false)
        .map(todo => ({
          ...todo,
          completed: true,
        }));
    }

    if (todos.every(todo => todo.completed === true)) {
      changingTodos = todos.map(todo => ({
        ...todo,
        completed: false,
      }));
    }

    const updatePromises = changingTodos.map(todo => updateTodo(todo));

    Promise.all(updatePromises)
      .then((updatedTodos) => {
        const newTodos = updatedTodos as Todo[];

        setTodos(currentTodos => {
          const updatedTodoIds = new Set(newTodos.map(todo => todo.id));
          const updatedTodosArray = currentTodos.map(todo => {
            if (updatedTodoIds.has(todo.id)) {
              const updatedTodo = newTodos.find(updated => updated.id === todo.id);

              return updatedTodo || todo;
            }

            return todo;
          });

          return updatedTodosArray;
        });
      })
      .catch(() => {
        setErrorMessage(ErrorType.updateTodo);
        setIsChangingStatus(false);
      })
      .finally(() => {
        setIsChangingStatus(false);
      });
  };

  const completedItems = todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: completedItems,
            })}
            onClick={handleCompliteAll}
          />

          <AddForm
            onSubmit={addTodo}
            title={title}
            setTitle={setTitle}
            setError={setErrorMessage}
          />
        </header>

        <AppList
          todos={filteredTodos}
          onDelete={removeTodo}
          isDeleted={deletedTodoId}
          isLoading={isLoading}
          title={title}
          onChange={changeTodo}
          isUpdatingId={isUpdatingId}
          isChansingStatus={isChansingStatus}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            setFilter={setFilter}
            onClear={removeTodo}
          />
        )}
      </div>

      <Notifications
        error={errorMessage}
        reset={setErrorMessage}
      />
    </div>
  );
};
