/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import './App.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import * as api from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoItem } from './components/Auth/TodoItem/TodoItem';
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
    setProcessing(prevstate => [...prevstate, id]);
  };

  const removeProcessing = (id: number) => {
    setProcessing(prevstate => prevstate.filter(item => item !== id));
  };

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

  const onDelete = (id: number) => {
    addProcessing(id);
    api.deleteTodo(id).then(() => {
      setTodos(prevstate => prevstate.filter(todo => todo.id !== id));
    }).catch(() => setError('Failed to delete'))
      .finally(() => removeProcessing(id));
  };

  const patchTodo = (newTodo: Todo) => {
    addProcessing(newTodo.id);
    api.patchTodo(newTodo).then(() => {
      setTodos(prevstate => prevstate
        .map(todo => (todo.id === newTodo.id ? newTodo : todo)));
    }).catch(() => setError('Failed to update'))
      .finally(() => removeProcessing(newTodo.id));
  };

  const toggleAll = () => {
    let toToggle;

    if (activeTodos.length === 0) {
      toToggle = completedTodos;
    } else {
      toToggle = activeTodos;
    }

    toToggle.forEach(todo => {
      patchTodo({ ...todo, completed: !todo.completed });
    });
  };

  const clearCompleted = () => {
    completedTodos.forEach(todo => {
      onDelete(todo.id);
    });
  };

  const onSubmit = () => {
    if (todoTitle.length === 0) {
      return;
    }

    if (user) {
      setIsCreating(true);
      api.createTodo(user.id, todoTitle, false).then((res) => {
        setTodos(prevstate => [...prevstate, res]);
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
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
            onClick={toggleAll}
          />

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
          <TransitionGroup>
            {visibleTodos.map(todo => (
              <CSSTransition
                key={todo.id}
                timeout={300}
                classNames="item"
              >
                <TodoItem
                  todo={todo}
                  onDelete={onDelete}
                  isProcessed={processing.includes(todo.id)}
                  onPatch={patchTodo}
                />
              </CSSTransition>
            ))}
            {isCreating && (
              <CSSTransition
                key={0}
                timeout={300}
                classNames="temp-item"
              >
                <TodoItem
                  todo={{
                    id: Math.random(),
                    title: todoTitle,
                    completed: false,
                    userId: user.id,
                  }}
                  isProcessed
                />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>
        {(todos.length > 0 || isCreating) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              4 items left
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
