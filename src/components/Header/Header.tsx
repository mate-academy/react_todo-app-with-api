/* eslint-disable react/display-name */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { todosContext } from '../../Store';
import classNames from 'classnames';
import { item, items } from '../../utils/utils';
import { errorText } from '../../constants';
import { addTodo } from '../../api/todos';

export const Header: React.FC = React.memo(() => {
  const { state, setters, handlers } = useContext(todosContext);
  const { selectedTodo, loadingTodos, todos } = state;
  const { handleUpdate } = handlers;
  const { setErrorMessage, setTempTodo, setTodos } = setters;
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const titleFild = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleFild.current && !selectedTodo) {
      titleFild.current.focus();
    }
  }, [selectedTodo, loadingTodos, todos]);

  function handleAdd() {
    const newTitle = title.trim();

    if (!newTitle) {
      setErrorMessage(errorText.emptyTitle);

      return;
    }

    if (!loading) {
      const newTodo = item.createNew(title, false);

      setLoading(true);
      setErrorMessage('');
      setTempTodo(newTodo);

      addTodo(newTodo)
        .then(todo => {
          setTodos(prevTodos => [...prevTodos, todo]);
        })
        .catch(error => {
          setErrorMessage(errorText.failAdding);
          throw error;
        })
        .finally(() => {
          setLoading(false);
          setTempTodo(null);
        })
        .then(() => setTitle(''));
    }
  }

  function toggleAll() {
    const uncompleted = items.uncompleted(todos);

    if (uncompleted.length > 0) {
      uncompleted.map(todo => {
        return handleUpdate(todo, !todo.completed, todo.title);
      });
    }

    if (uncompleted.length === 0 && todos.length > 0) {
      todos.map(todo => {
        return handleUpdate(todo, !todo.completed, todo.title);
      });
    }
  }

  const allTodosAreCompleted = items.completed(todos).length === todos.length;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleAdd();
  }

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodosAreCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={titleFild}
          disabled={loading}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
});
