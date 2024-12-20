/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { FilterOptions } from './types/FilterOptions';
import { Todolist } from './components/TodoList';
import classNames from 'classnames';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentFilter, setCurrentFilter] = useState<string>('All');
  const [errorMessage, setErrorMessage] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingId, setDeletingID] = useState([0]);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDelete = (todoId: number): Promise<void> => {
    setDeletingID(prev => [...prev, todoId]);

    return todoService
      .deleteTodos(todoId)
      .then(() => {
        setLoading(true);
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setLoading(false);
        setDeletingID((prev: number[]) => prev.filter(id => id !== todoId));
        setTimeout(() => setErrorMessage(''), 3000);
      });
  };

  const handleUpdateTodo = (updatedTodo: Todo): Promise<void> => {
    setLoadingIds(prevState => [...prevState, updatedTodo.id]);

    return todoService
      .updateTodos(updatedTodo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(item =>
            item.id === updatedTodo.id ? updatedTodo : item,
          ),
        );
      })
      .catch(error => {
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        setLoadingIds(prevState =>
          prevState.filter(id => id !== updatedTodo.id),
        );
        setTimeout(() => setErrorMessage(''), 3000);
      });
  };

  const filteredTodos = useMemo(() => {
    switch (currentFilter) {
      case FilterOptions.Active:
        return todos.filter(todo => !todo.completed);
      case FilterOptions.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [currentFilter, todos]);

  const newTodo: Todo = {
    id: 0,
    title: newTodoTitle.trim(),
    userId: USER_ID,
    completed: false,
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setErrorMessage('Title should not be empty');
      inputRef.current?.focus();
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    setTempTodo(newTodo);

    try {
      const addNewTodo = await todoService.postTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, addNewTodo]);
      setNewTodoTitle('');
      setErrorMessage('');
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      inputRef.current?.focus();
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const completedAllTodos = () => {
    const allCompleted = todos.every(todo => todo.completed);

    if (allCompleted) {
      todos.forEach(todo => {
        handleUpdateTodo({
          ...todo,
          completed: false,
        });
      });
    } else {
      todos
        .filter(todo => !todo.completed)
        .forEach(todo => {
          handleUpdateTodo({
            ...todo,
            completed: true,
          });
        });
    }
  };

  const toggleTodoCompletion = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, inputRef]);

  const loadTodos = () => {
    setLoading(true);

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => {
        setLoading(false);
        inputRef.current?.focus();
        setTimeout(() => setErrorMessage(''), 3000);
      });
  };

  useEffect(loadTodos, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>
        <div className="todoapp__content">
          <header className="todoapp__header">
            {todos.length > 0 && (
              <button
                type="button"
                className={classNames('todoapp__toggle-all', {
                  active: todos.every(todo => todo.completed),
                })}
                data-cy="ToggleAllButton"
                onClick={completedAllTodos}
              />
            )}

            <form onSubmit={handleSubmit}>
              <input
                value={newTodoTitle}
                ref={inputRef}
                onChange={e => setNewTodoTitle(e.target.value)}
                data-cy="NewTodoField"
                type="text"
                className={classNames('todoapp__new-todo', {
                  focused: inputRef.current?.focus(),
                })}
                placeholder="What needs to be done?"
                disabled={tempTodo !== null}
                autoFocus
              />
            </form>
          </header>

          <Todolist
            onToggleTodo={toggleTodoCompletion}
            onDelete={handleDelete}
            onUpdate={handleUpdateTodo}
            deletingId={deletingId}
            filteredTodos={filteredTodos}
            setErrorMessage={setErrorMessage}
            loadingIds={loadingIds}
            tempTodo={tempTodo}
          />

          {todos.length !== 0 && (
            <Footer
              todos={todos}
              onDelete={handleDelete}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
              loading={loading}
            />
          )}
        </div>

        <div
          data-cy="ErrorNotification"
          className={classNames(
            'notification is-danger is-light has-text-weight-normal',
            { hidden: !errorMessage },
          )}
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setErrorMessage('')}
          />
          {errorMessage}
        </div>
      </div>
    </>
  );
};
