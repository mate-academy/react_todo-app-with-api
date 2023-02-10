/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import * as todosAPI from './api/todos';
import { Footer } from './components/Footer';
import { Form } from './components/Form';
import { TodoList } from './components/TodoList';
import { Errors, Filter, Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

const USER_ID = 6101;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosBeingTransform, setTodosBeingTransform] = useState<number[]>([]);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  useEffect(() => {
    todosAPI.getTodos(USER_ID)
      .then((data) => {
        setTodos(data);
        setError('');
      })
      .catch(() => {
        setError(Errors.LOADING);
      })
      .finally(() => {
        setTimeout(() => {
          setError('');
        }, 3000);
      });
  }, []);

  const handleAddTodo = (todoData: Omit<Todo, 'id'>) => {
    if (!todoData.title) {
      setError(Errors.TITLE);

      setTimeout(() => {
        setError('');
      }, 3000);

      return;
    }

    setTempTodo({ ...todoData, id: 0 });

    todosAPI.addTodo(todoData)
      .then((newTodo) => (
        setTimeout(() => {
          setTodos([...todos, newTodo]);
          setTempTodo(null);
        }, 3000)
      ))
      .catch(() => {
        setError(Errors.ADDING);

        setTimeout(() => {
          setError('');
        }, 3000);
      });
  };

  const handleRemoveTodo = (todoId: number) => {
    setTodosBeingTransform(current => [...current, todoId]);
    todosAPI.deleteTodo(todoId)
      .then(() => {
        setTodos(
          (currentTodos) => currentTodos.filter((todo) => todo.id !== todoId),
        );
      })
      .catch(() => {
        setError(Errors.REMOVING);

        setTimeout(() => {
          setError('');
        }, 3000);
      })

      .finally(() => {
        setTodosBeingTransform(
          todosBeingTransform.filter((id) => id !== todoId),
        );
      });
  };

  const handleUpdateTodo = (todoToUpdate: Todo) => {
    setTodosBeingTransform(current => [...current, todoToUpdate.id]);
    todosAPI.updateTodo(todoToUpdate)
      .then(() => {
        setTodos(
          todos.map((todo) => {
            if (todo.id === todoToUpdate.id) {
              return todoToUpdate;
            }

            return todo;
          }),
        );
      })
      .catch(() => {
        setError(Errors.UPDATING);

        setTimeout(() => {
          setError('');
        }, 3000);
      })

      .finally(() => (
        setTodosBeingTransform(
          todosBeingTransform.filter((id) => id !== todoToUpdate.id),
        )));
  };

  const handleToggleAll = () => {
    todos.forEach((todo) => {
      if (!todo.completed) {
        return { ...todo, completed: !todo.completed };
      }

      if (todos.every((element) => element.completed)) {
        return { ...todo, completed: !todo.completed };
      }

      return 0;
    });
  };

  const visibleTodos = todos
    .filter((todo) => {
      switch (filter) {
        case Filter.ACTIVE:
          return !todo.completed;
        case Filter.COMPLETED:
          return todo.completed;
        default:
          return true;
      }
    });

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              { active: todos.some((todo) => !todo.completed) },
            )}
            onClick={handleToggleAll}
          />
          <Form
            onSubmit={handleAddTodo}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            userId={USER_ID}
          />
        </header>
        {todos && (
          <>
            <TodoList
              userID={USER_ID}
              setSelectedTodoId={setSelectedTodoId}
              selectedTodoId={selectedTodoId}
              onTodoDelete={handleRemoveTodo}
              todos={visibleTodos}
              onTodoUpdate={handleUpdateTodo}
              todosBeingTransform={todosBeingTransform}
            />
            {tempTodo && (
              <>
                <div
                  key={tempTodo.id}
                  className={classNames(
                    'todo',
                    { completed: tempTodo.completed },
                  )}
                >
                  <label
                    className="todo__status-label"
                  >
                    <input
                      type="checkbox"
                      className="todo__status"
                      checked={tempTodo.completed}
                    />
                  </label>
                  <span
                    className="todo__title"
                  >
                    {tempTodo.title}
                  </span>
                  <button
                    type="button"
                    className="todo__remove"
                  >
                    ×
                  </button>
                </div>
              </>
            )}
            <Footer
              activeTodos={activeTodos}
              completedTodos={completedTodos}
              filter={filter}
              onSetFilter={setFilter}
              handleRemoveTodo={handleRemoveTodo}
            />
          </>
        )}
        {error && (
          <div
            className={classNames(
              'notification is-danger is-light has-text-weight-normal',
              { hidden: !error },
            )}
          >
            <button
              type="button"
              className="delete"
              onClick={() => {
                setError('');
              }}
            />
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
