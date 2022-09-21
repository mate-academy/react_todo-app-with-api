/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cN from 'classnames';
import {
  createTodo,
  getTodos,
  removeTodo,
  updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { FilterStatus } from './types/FilterStatus';
import { Todo } from './types/Todo';
import { Error } from './types/Errors';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodos, setSelectedTodos] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAdding, setIsAdding] = useState(false);
  const [toggle, setToggle] = useState(true);

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case FilterStatus.All:
        return todo;

      case FilterStatus.Active:
        return !todo.completed;

      case FilterStatus.Completed:
        return todo.completed;

      default:
        return null;
    }
  });

  let userId = 0;

  if (user?.id) {
    userId = user.id;
  }

  if (error) {
    setTimeout(() => {
      setError(null);
      setIsAdding(false);
    }, 3000);
  }

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    getTodos(userId)
      .then(setTodos)
      .catch(() => setError(Error.LOADING));
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(Error.TITLE);

      return;
    }

    setIsAdding(true);

    await createTodo(userId, title)
      .then(todo => {
        setTodos([...todos, todo]);
      })
      .catch(() => {
        setError(Error.ADDING);
      });

    setIsAdding(false);
    setTitle('');
  };

  const deleteTodo = (todoId: number) => {
    setSelectedTodos([todoId]);
    removeTodo(todoId)
      .then(() => {
        setTodos([...todos.filter(todo => todo.id !== todoId)]);
      })
      .catch(() => {
        setError(Error.DELETING);
        setSelectedTodos([]);
      });
  };

  const completeTodos = todos.filter(todo => todo.completed);

  const clearCompleted = () => {
    setSelectedTodos([...completeTodos].map(todo => todo.id));

    Promise.all(completeTodos.map(todo => removeTodo(todo.id)))
      .then(() => {
        setTodos([...todos.filter(todo => !todo.completed)]);
      })
      .catch(() => {
        setError(Error.DELETING);
        setSelectedTodos([]);
      });
  };

  const updatedTodo = async (todoId: number, data: Partial<Todo>) => {
    setSelectedTodos([todoId]);

    await updateTodo(todoId, data)
      .then((res) => {
        setTodos(todos.map(todo => (
          todo.id === todoId
            ? res
            : todo
        )));
      })
      .catch(() => {
        setError(Error.UPDATING);
      });

    setSelectedTodos([]);
  };

  const notCompleteTodos = todos.filter(todo => !todo.completed);

  const onToggleAll = async () => {
    setSelectedTodos((toggle
      ? [...notCompleteTodos].map(todo => todo.id)
      : [...completeTodos].map(todo => todo.id)
    ));

    await Promise
      .all(todos.map(todo => (
        todo.completed !== toggle
          ? updateTodo(todo.id, { completed: toggle })
          : todo
      )))
      .then(setTodos)
      .catch(() => {
        setError(Error.UPDATING);
      });

    setToggle(!toggle);
    setSelectedTodos([]);
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
              className={cN(
                'todoapp__toggle-all',
                { active: todos.length === completeTodos.length },
              )}
              onClick={onToggleAll}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              disabled={isAdding}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              title={title}
              onDelete={deleteTodo}
              selectTodo={setSelectedTodos}
              isAdding={isAdding}
              selectedTodo={selectedTodos}
              onCompleted={updatedTodo}
            />
            <Footer
              todos={todos}
              onFilterStatus={setFilterStatus}
              filterStatus={filterStatus}
              onClear={clearCompleted}
              completeTodos={completeTodos}
            />
          </>
        )}
      </div>

      {(error) && (
        <ErrorNotification
          errors={error}
          onErrorChange={setError}
        />
      )}
    </div>
  );
};
