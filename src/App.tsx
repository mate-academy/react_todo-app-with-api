/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext, useEffect, useRef, useState,
} from 'react';
import * as api from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoItem } from './components/Todo/TodoItem';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [processing, setProcessing] = useState<number[]>([]);
  const [filterBy, setFilterBy] = useState('All');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      api.getTodos(user.id).then(response => {
        setTodos(response);
      });
    }

    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const addProcessing = (id: number) => {
    setProcessing(prev => [...prev, id]);
  };

  const removeProcessing = (id: number) => {
    setProcessing(prev => prev.filter(item => item !== id));
  };

  const onRemove = useCallback((id: number) => {
    addProcessing(id);
    api.removeTodo(id).then(() => {
      setTodos(prev => prev.filter(todo => todo.id !== id));
    }).catch(() => setError('Failed to delete'))
      .finally(() => removeProcessing(id));
  }, [todos]);

  const editTodo = useCallback((newTodo: Todo) => {
    addProcessing(newTodo.id);
    api.editTodo(newTodo).then(() => {
      setTodos(prev => prev
        .map(todo => (todo.id === newTodo.id ? newTodo : todo)));
    }).catch(() => setError('Failed to update'))
      .finally(() => removeProcessing(newTodo.id));
  }, [todos]);

  if (!user) {
    return <p>Please Login</p>;
  }

  const visibleTodos = todos.filter(todo => {
    switch (filterBy) {
      case 'Active':
        return !todo.completed;
      case 'Completed':
        return todo.completed;
      case 'All':
      default:
        return todo;
    }
  });

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const toggleAll = () => {
    let toToggle;

    if (activeTodos.length === 0) {
      toToggle = completedTodos;
    } else {
      toToggle = activeTodos;
    }

    toToggle.forEach(todo => {
      editTodo({ ...todo, completed: !todo.completed });
    });
  };

  const clearCompleted = () => {
    Promise.all(completedTodos.map(todo => {
      return onRemove(todo.id);
    }));
  };

  const onSubmit = () => {
    if (todoTitle.trim().length === 0) {
      return;
    }

    if (user) {
      setIsCreating(true);
      api.addNewTodo(user.id, todoTitle, false).then((res) => {
        setTodos(prev => [...prev, res]);
      }).catch(() => setError('Failed to add'))
        .finally(() => {
          setTodoTitle('');
          setIsCreating(false);
        });
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className="todoapp__toggle-all active"
              onClick={toggleAll}
            />
          )}

          <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={(e) => setTodoTitle(e.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoItem
              todo={todo}
              onRemove={onRemove}
              isProcessed={processing.includes(todo.id)}
              onEdit={editTodo}
            />
          ))}
          {isCreating && (
            <TodoItem
              todo={{
                id: -1,
                title: todoTitle,
                completed: false,
                userId: user.id,
              }}
              isProcessed
            />
          )}
        </section>
        {(todos.length > 0 || isCreating) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${activeTodos.length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                data-cy="FilterLinkAll"
                href="#/"
                className={`filter__link ${filterBy === 'All' && 'selected'}`}
                onClick={() => setFilterBy('All')}
              >
                All
              </a>

              <a
                data-cy="FilterLinkActive"
                href="#/active"
                className={`filter__link ${filterBy === 'Active' && 'selected'}`}
                onClick={() => setFilterBy('Active')}
              >
                Active
              </a>
              <a
                data-cy="FilterLinkCompleted"
                href="#/completed"
                className={`filter__link ${filterBy === 'Completed' && 'selected'}`}
                onClick={() => setFilterBy('Completed')}
              >
                Completed
              </a>
            </nav>

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              onClick={clearCompleted}
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
            onClick={() => setError('')}
          />
          {error}
        </div>
      )}
    </div>
  );
};
