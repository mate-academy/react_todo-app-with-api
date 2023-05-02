/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { deleteTodo, getTodos, updateTodo } from './api/todos';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoList } from './components/Todolist/TodoList';
import { TodosFilter } from './components/TodosFilter/TodosFilter';
import { USER_ID } from './config';
import { useTodoContext } from './context/TodoContext';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    setTodoIdsInUpdating,
    setError,
  } = useTodoContext();

  const hasTodos = todos.length > 0;
  const hasCompletedTodos = todos.some((todo) => todo.completed);
  const hasActiveTodos = todos.some((todo) => !todo.completed);

  const itemsLeft = todos.filter((todo) => !todo.completed).length;

  const handleDeleteCompleted = () => {
    const completedTodoIds = todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);

    Promise.all(completedTodoIds.map((todoId) => deleteTodo(todoId)))
      .then(() => {
        setTodos((prevTodos) => {
          return prevTodos.filter((prevTodo) => !prevTodo.completed);
        });
      })
      .catch(() => {
        setError('Unable to delete todos');
      });
  };

  const handleAllTodosStatusEdit = () => {
    let todosForUpdate: Todo[] = [];

    if (hasActiveTodos) {
      todosForUpdate = todos
        .filter((todo) => !todo.completed)
        .map((todo) => {
          const copiedTodo = { ...todo };

          copiedTodo.completed = true;

          return copiedTodo;
        });
    } else {
      todosForUpdate = todos.map((todo) => {
        const copiedTodo = { ...todo };

        copiedTodo.completed = false;

        return copiedTodo;
      });
    }

    setTodoIdsInUpdating(todosForUpdate.map((todo) => todo.id));

    Promise.all(
      todosForUpdate.map((todo) => {
        return updateTodo(todo.id, { completed: todo.completed });
      }),
    )
      .then(() => {
        setTodos((prevTodos) => {
          return prevTodos.map((prevTodo) => {
            const updatedTodoIndex = todosForUpdate.findIndex(
              (todo) => todo.id === prevTodo.id,
            );
            const isUpdatedTodo = updatedTodoIndex > -1;

            if (isUpdatedTodo) {
              return todosForUpdate[updatedTodoIndex];
            }

            return prevTodo;
          });
        });
      })
      .catch(() => {
        setError('Unable to update a todo');
      })
      .finally(() => setTodoIdsInUpdating([]));
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((fetchedTodos: Todo[]) => {
        setTodos(fetchedTodos);
      })
      .catch((fetchedError: Error) => {
        setError(fetchedError?.message ?? 'Something went wrong');
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
          {hasTodos && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: hasActiveTodos,
              })}
              onClick={handleAllTodosStatusEdit}
            />
          )}

          <TodoForm />
        </header>

        <TodoList />

        {hasTodos && (
          <footer className="todoapp__footer">
            <span className="todo-count">{`${itemsLeft} items left`}</span>

            <TodosFilter />

            {hasCompletedTodos && (
              <button
                type="button"
                className="todoapp__clear-completed"
                onClick={handleDeleteCompleted}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
