/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoItem } from './components/Todo/TodoItem';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [error, setError] = useState('');
  const [hidden, setHidden] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [isToggle, setIsToggle] = useState(false);
  const [loadingTodosId, setLoadingTodosId] = useState<number[]>([]);

  const filteredTodos = todos.filter(todo => {
    switch (sortBy) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return todos;
    }
  });

  const switchError = (newError: string) => {
    setError(newError);
    setTimeout(() => setError(''), 3000);
  };

  const addTodo = async (event: FormEvent) => {
    event.preventDefault();

    if (!todoTitle) {
      switchError('Title cant be empty');

      return;
    }

    if (!user) {
      return;
    }

    const newTodoId = -(todos.length);
    const newTodo = {
      id: newTodoId,
      userId: user.id,
      title: todoTitle,
      completed: false,
    };

    setTodos(prev => [...prev, newTodo]);
    setLoadingTodosId(prev => [...prev, newTodoId]);

    try {
      const createdTodo = await createTodo(user.id, todoTitle);

      setTodos(prev => prev.map(todo => {
        if (todo.id === newTodoId) {
          return createdTodo;
        }

        return todo;
      }));
    } catch {
      setTodos(prev => prev.filter(todo => todo.id !== newTodoId));
      switchError('Unable to add todo');
    }

    setTodoTitle('');
    setLoadingTodosId(prev => prev.filter(curr => curr !== newTodo.id));
  };

  const removeTodo = useCallback(async (todoId: number) => {
    setLoadingTodosId(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(
        currentTodo => currentTodo.id !== todoId,
      ));
    } catch {
      switchError('Unable to delete todo');
    }

    setLoadingTodosId(todosId => todosId.filter(curr => curr !== todoId));
  }, [deleteTodo]);

  const changeTodo = useCallback(async (id: number, data: any) => {
    setLoadingTodosId(todosId => [...todosId, id]);

    const updatedTodo = await updateTodo(id, data);

    setTodos(prev => prev.map(todo => {
      if (todo.id === id) {
        return updatedTodo;
      }

      return todo;
    }));

    setLoadingTodosId(todosId => todosId.filter(curr => curr !== id));
  }, [updateTodo]);

  const closeNotification = () => {
    setHidden(prev => !prev);
    setError('');
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    getTodos(user.id)
      .then(setTodos);
  }, [user]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              onClick={() => {
                setIsToggle(prev => !prev);

                todos.map(todo => (
                  changeTodo(todo.id, {
                    completed: isToggle, loading: isToggle,
                  })
                ));
              }}
              className={classNames('todoapp__toggle-all', {
                active: todos.filter(
                  todo => todo.completed,
                ).length === todos.length,
              })}
            />
          )}

          <form onSubmit={addTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={(e) => {
                setTodoTitle(e.target.value);
                setError('');
              }}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              todo={todo}
              key={todo.id}
              removeTodo={removeTodo}
              changeTodo={changeTodo}
              loadingTodosId={loadingTodosId}
            />
          ))}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${todos.filter(todo => !todo.completed).length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                data-cy="FilterLinkAll"
                href="#/"
                className={classNames('filter__link', {
                  selected: sortBy === 'all',
                })}
                onClick={() => setSortBy('all')}
              >
                All
              </a>

              <a
                data-cy="FilterLinkActive"
                href="#/active"
                className={classNames('filter__link', {
                  selected: sortBy === 'active',
                })}
                onClick={() => setSortBy('active')}
              >
                Active
              </a>
              <a
                data-cy="FilterLinkCompleted"
                href="#/completed"
                className={classNames('filter__link', {
                  selected: sortBy === 'completed',
                })}
                onClick={() => setSortBy('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              hidden={todos.filter(todo => todo.completed).length === 0}
              onClick={() => {
                setIsToggle(prev => !prev);
                setTodos(prev => prev.filter(todo => {
                  if (todo.completed) {
                    removeTodo(todo.id);
                  }

                  return todo;
                }));
              }}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {error && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={closeNotification}
            hidden={hidden}
          />
          {error}
        </div>
      )}
    </div>
  );
};
