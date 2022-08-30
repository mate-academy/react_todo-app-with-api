/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import {
  addTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { AddTodoForm } from './components/AddTodoForm';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer';
import { TodoItem } from './components/TodoItem';
import { Todo } from './types/Todo';

type FilteredTodos = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilteredTodos>('all');
  const [error, setError] = useState('');
  const [isAllTodoDone, setIsAllTodoDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTodoId, setActiveTodoId] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then((res) => {
          setTodos(res);
        });
    }
  }, [user]);

  const onAddTodo = (todo: Todo) => {
    setTodos((prevTodos) => (
      [...prevTodos, todo]
    ));
  };

  const handlerAddTodo = useCallback(async (title: string) => {
    setLoading(true);

    if (!user) {
      return;
    }

    if (!title.trim()) {
      setError('Please add title');

      return;
    }

    const optimisticResponseId = -(todos.length);

    const newTodo = {
      id: optimisticResponseId,
      userId: user.id,
      title,
      completed: false,
    };

    onAddTodo(newTodo);
    setActiveTodoId(optimisticResponseId);

    try {
      const createdTodo = await addTodo({
        title,
        userId: user.id,
        completed: false,
      });

      setTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id === optimisticResponseId) {
          return createdTodo;
        }

        return todo;
      }));
    } catch {
      setTodos(
        prevTodos => prevTodos.filter(todo => todo.id !== optimisticResponseId),
      );

      setError('Unable to add a todo');
    }

    setLoading(false);
    setError('');
  }, [user, todos.length]);

  const getFilteredTodos = useCallback((filterType: FilteredTodos) => {
    switch (filterType) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos]);

  const removeTodo = useCallback(async (todoId: number) => {
    setLoading(true);
    setActiveTodoId(todoId);

    if (!user) {
      return;
    }

    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
    }

    setLoading(false);
  }, [user]);

  const delAllCompletedTodoHandler = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  }, [removeTodo, todos]);

  const changeStatusTodos = useCallback(() => {
    const newTodoList = [...todos].map(todo => {
      updateTodo(todo.id, !isAllTodoDone, todo.title)
        .catch(() => setError('Unable to update a todo'));

      return {
        ...todo,
        completed: !isAllTodoDone,
      };
    });

    setTodos(newTodoList);
    setIsAllTodoDone((prev) => !prev);
  }, [isAllTodoDone, todos]);

  const filteredTodos = getFilteredTodos(filter);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                {
                  active: todos.length && todos.every(todo => todo.completed),
                },
              )}
              onClick={() => changeStatusTodos()}
            />
          )}

          <AddTodoForm handleCreateTodo={handlerAddTodo} />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              todo={todo}
              todos={todos}
              setTodos={setTodos}
              key={todo.id}
              setError={setError}
              loading={loading}
              activeTodoId={activeTodoId}
              remove={removeTodo}
            />
          ))}
        </section>

        <footer className="todoapp__footer" data-cy="Footer">
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            deleteAllCompleted={delAllCompletedTodoHandler}
          />
        </footer>
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: error === '',
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />

        {error}
      </div>
    </div>
  );
};
