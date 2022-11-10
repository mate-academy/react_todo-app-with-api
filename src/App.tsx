import React, {
  useContext, useEffect, useRef, useState, useMemo,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import {
  getTodos, postTodo, deleteTodo, patchTodo,
} from './api/todos';
import { TodoFooter } from './components/TodoFooter';
import { Status } from './types/Status';
import { Errors } from './types/Errors';
import { TodoError } from './components/TodoError';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const toggleButton = useRef<HTMLButtonElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState(Errors.None);
  const [filter, setFilter] = useState(Status.All);
  const [isAdding, setIsAdding] = useState(false);
  const [addedTodo, setAddedTodo] = useState<Todo | null>(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [isToggleAll, setIsToggleAll] = useState(false);

  const loadTodos = async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      }
    } catch {
      setError(Errors.Load);
    }
  };

  const addTodo = async (todo: Todo) => {
    setIsAdding(true);

    try {
      const newTodo = await postTodo(todo);

      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch {
      setError(Errors.Add);
    } finally {
      setIsAdding(false);
      setAddedTodo(null);
    }
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();
  }, []);

  const handleNewTodoKeyDown = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const val = newTodoField.current?.value;

    if (!val) {
      setError(Errors.Title);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: user ? user.id : 0,
      title: val,
      completed: false,
    };

    setAddedTodo(newTodo);
    addTodo(newTodo);
    newTodoField.current.value = '';
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setIsDeletingAll(true);

    try {
      await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));

      loadTodos();
    } catch (e) {
      setError(Errors.DeleteCompleted);
    } finally {
      setIsDeletingAll(false);
    }
  };

  const handleToggleAll = async () => {
    const toggleAll = toggleButton.current?.classList.contains('active');
    const todosToToggle = toggleAll
      ? todos
      : todos.filter(todo => !todo.completed);

    setIsToggleAll(true);

    try {
      await Promise.all(
        todosToToggle.map(todo => patchTodo(
          todo, { completed: !todo.completed },
        )),
      );

      loadTodos();
    } catch {
      setError(Errors.UpdateAll);
    } finally {
      setIsToggleAll(false);
    }
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case Status.Active:
          return !todo.completed;

        case Status.Completed:
          return todo.completed;

        default:
          return true;
      }
    });
  }, [todos, filter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={classNames(
              { 'todoapp__toggle-all': todos.length },
              { active: todos.every(todo => todo.completed) },
            )}
            aria-label="ToogleAllButton"
            hidden={!todos.length}
            onClick={() => handleToggleAll()}
            ref={toggleButton}
          />

          <form onSubmit={(event) => handleNewTodoKeyDown(event)}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isAdding}
            />
          </form>
        </header>

        {todos.length > 0
          && (
            <>
              <TodoList
                todos={filteredTodos}
                addedTodo={addedTodo}
                setTodos={setTodos}
                setError={setError}
                isDeletingAll={isDeletingAll}
                isToggleAll={isToggleAll}
              />
              <TodoFooter
                todos={todos}
                filter={filter}
                setFilter={setFilter}
                clearCompleted={handleClearCompleted}
              />
            </>
          )}
      </div>

      {error !== Errors.None && (
        <TodoError
          error={error}
          setError={setError}
        />
      )}
    </div>
  );
};
