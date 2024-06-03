/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import classNames from 'classnames';
import { TodoList } from './TodoList';
import { TodoFilter } from './TodoFilter';
import { TodoErrors } from './TodoErrors';
import { TodosContext } from './Todos.Context';
import { updateTodos } from '../api/todos';

export const TodoApp: React.FC = () => {
  const {
    addTodo,
    todos,
    setTodos,
    setError,
    submitting,
    setNewTodo,
    newTodo,
    setTempTodo,
    setLoading,
  } = useContext(TodosContext);

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      addTodo({
        id: +new Date(),
        userId: 206,
        title: newTodo.trim(),
        completed: false,
      });
      setTempTodo({
        id: 0,
        title: newTodo.trim(),
        userId: 206,
        completed: false,
      });

      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        clearNewTodo();
      }, 3000);
    } else {
      setError('Title should not be empty');
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  const clearNewTodo = () => {
    setNewTodo('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting) {
      handleAddTodo();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && newTodo.length !== 0) {
      handleAddTodo();
    }

    if (event.key === 'Enter' && newTodo.length === 0) {
      setError('Title should not be empty');
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  const handleToggleAll = () => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const newTodo = [...todos];
    // const allCompleted = newTodo.every(item => item.completed);
    const filteredTodos = newTodo.filter(item => !item.completed);

    const updatePromises = newTodo.map(todo => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, userId, title, completed } = todo;

      setLoading(prevLoading => ({
        ...prevLoading,
        [id]: true,
      }));

      if (filteredTodos.length > 0) {
        // eslint-disable-next-line consistent-return
        filteredTodos.forEach(item => {
          if (item.id === todo.id) {
            return updateTodos({ id, userId, title, completed: !completed });
          }
        });
      }

      return updateTodos({ id, userId, title, completed: !completed });
    });

    Promise.all(updatePromises)
      .then(updatedTodos => {
        setTodos(updatedTodos);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error('Unable to update all todos', err);
        setError('Unable to update all todos');
        setTimeout(() => {
          setError('');
        }, 3000);
      })
      .finally(() => {
        // eslint-disable-next-line array-callback-return
        todos.map(todo => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id } = todo;

          setLoading(prevLoading => ({
            ...prevLoading,
            [id]: false,
          }));
        });
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {!!todos.length && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: todos.length > 0 && todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={submitting}
              id="todoInput"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </form>
        </header>
        {!!todos.length && (
          <>
            <TodoList />
            <TodoFilter />
          </>
        )}
      </div>

      <TodoErrors />
    </div>
  );
};
