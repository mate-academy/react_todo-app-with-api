import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo, Filter } from './types/Todo';
import {
  USER_ID, addTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [isLoading, setIsLoading] = useState(false);
  const [TodoItem, setTodoItem] = useState<Todo | null>(null);
  const [currentTodoLoading, setCurrentTodoLoading] = useState<number | null>(
    null,
  );

  const newTodoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (newTodoInputRef.current) {
      newTodoInputRef.current.focus();
    }
  }, []);

  const handleErrorMessage = (message: string | null) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  const focusOnNewTodoInput = () => {
    if (newTodoInputRef.current) {
      newTodoInputRef.current.focus();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleAddTodo = async (title: string) => {
    const trimmedTitle = title.trim();

    const newTodo: Omit<Todo, 'id'> = {
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTodoItem({ ...newTodo, id: 0 });

    if (!trimmedTitle) {
      handleErrorMessage('Title should not be empty');

      return;
    }

    setIsLoading(true);

    try {
      const createdTodo = await addTodo(newTodo);

      setTodos([...todos, createdTodo]);
      setTitle('');
    } catch (e) {
      handleErrorMessage('Unable to add a todo');
    } finally {
      setTodoItem(null);
      setIsLoading(false);
      focusOnNewTodoInput();
    }
  };

  const handleDeleteTodo = async (todo: Todo) => {
    setIsLoading(true);
    setCurrentTodoLoading(todo.id);

    try {
      await deleteTodo(todo.id);

      setTodos((prevTodos) => prevTodos.filter((item) => item.id !== todo.id));
    } catch (err) {
      handleErrorMessage('Unable to delete a todo');
    } finally {
      setIsLoading(false);
      focusOnNewTodoInput();
    }
  };

  const handleClearCompleted = async () => {
    setIsLoading(true);

    try {
      const completedTodos = todos.filter((todo) => todo.completed);

      await Promise.all(
        completedTodos.map(async (todo) => {
          await deleteTodo(todo.id);
          setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
        }),
      );
    } catch (err) {
      handleErrorMessage('Unable to delete a todo');
    } finally {
      setIsLoading(false);
      setCurrentTodoLoading(null);
      focusOnNewTodoInput();
    }
  };

  const handleToggleComplete = async (todoToToggle: Todo) => {
    setIsLoading(true);
    setCurrentTodoLoading(todoToToggle.id);

    const updatedTodos = todos.map((todo) => {
      return todo.id === todoToToggle.id
        ? { ...todo, completed: !todoToToggle.completed }
        : todo;
    });

    try {
      await updateTodo(todoToToggle.id, { completed: !todoToToggle.completed });
      setTodos(updatedTodos);
    } catch (err) {
      handleErrorMessage('Unable to update a todo');
    } finally {
      setIsLoading(false);
      setCurrentTodoLoading(null);
    }
  };

  const changeFilterStatus = (type: 'All' | 'Active' | 'Completed') => {
    setFilter(type);
  };

  const toggleAll = async () => {
    setIsLoading(true);

    try {
      const allCompleted = todos.every((todo) => todo.completed);
      const updatedTodos = todos.map((todo) => ({
        ...todo,
        completed: !allCompleted,
      }));

      // Send requests only for the todos whose statuses were actually changed
      const promises = updatedTodos
        .filter((todo) => todo.completed !== allCompleted)
        .map(async (todo) => {
          await updateTodo(todo.id, { completed: !allCompleted });
        });

      await Promise.all(promises);
      setTodos(updatedTodos);
    } catch (err) {
      handleErrorMessage('Unable to update a todo');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setErrorMessage(null);
    if (USER_ID) {
      getTodos(USER_ID)
        .then((data) => {
          setTodos(data);
        })
        .catch(() => {
          handleErrorMessage('Unable to load todos');
        });
    }
  }, []);

  const remainingItems = todos.filter((todo) => !todo.completed).length;
  const completedItems = todos.filter((todo) => todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            data-cy="ToggleAllButton"
            className={`todoapp__toggle-all ${
              todos.every((todo) => todo.completed) ? 'active' : ''
            }`}
            onClick={() => toggleAll()}
          />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddTodo(title);
            }}
          >
            <input
              ref={newTodoInputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </form>
        </header>
        {todos.length > 0 && (
          <>
            <TodoList
              todos={todos}
              filterType={filter}
              handleDeleteTodo={handleDeleteTodo}
              handleToggleComplete={handleToggleComplete}
              todoItem={TodoItem}
              currentTodoLoading={currentTodoLoading}
              handleErrorMessage={handleErrorMessage}
            />

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {`${remainingItems} items left`}
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={`filter__link ${filter === 'All' ? 'selected' : ''}`}
                  onClick={() => changeFilterStatus('All')}
                  data-cy="FilterLinkAll"
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={`filter__link ${
                    filter === 'Active' ? 'selected' : ''
                  }`}
                  onClick={() => changeFilterStatus('Active')}
                  data-cy="FilterLinkActive"
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={`filter__link ${
                    filter === 'Completed' ? 'selected' : ''
                  }`}
                  onClick={() => changeFilterStatus('Completed')}
                  data-cy="FilterLinkCompleted"
                >
                  Completed
                </a>
              </nav>

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={handleClearCompleted}
                disabled={completedItems === 0}
                hidden={completedItems === 0}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
