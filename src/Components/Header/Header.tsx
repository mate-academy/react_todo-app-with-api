/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { TodosContext, USERS_URL, USER_ID } from '../Store/Store';
import { Todo } from '../../Types/Todo';
import { client } from '../../utils/fetchClient';

type Props = {};

export const Header: React.FC<Props> = React.memo(() => {
  const {
    todos,
    setTodos,
    setErrorMessage,
    setTempItem,
    creating,
    setCreating,
    focus,
    addProcessing,
    removeProcessing,
  } = useContext(TodosContext);

  const hasToggle = todos.length > 0;
  const activeTodos = todos.filter(todo => !todo.completed);
  const hasActiveTodos = activeTodos.length > 0;

  const [title, setTitle] = useState('');

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const addTempItem = useCallback(
    (newTodo: Todo) => {
      setTempItem(newTodo);
    },
    [setTempItem],
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    addTempItem({ ...newTodo, id: 0 });

    setErrorMessage('');
    setCreating(true);

    client
      .post<Todo>(USERS_URL + USER_ID, newTodo)
      .then(createdTodo => {
        setTodos(current => [...current, createdTodo]);
        setTitle('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setCreating(false);
        setTempItem(null);
      });
  };

  const handleToggleAll = async () => {
    const todosToToggle = todos.filter(
      todo => todo.completed === !hasActiveTodos,
    );

    todosToToggle.map(todo => addProcessing(todo.id));
    setErrorMessage('');

    try {
      await Promise.all(
        todosToToggle.map(todo =>
          client.patch<Todo>(`/${todo.id}`, { completed: hasActiveTodos }),
        ),
      );

      const updatedTodos = todos.map(todo => ({
        ...todo,
        completed: hasActiveTodos,
      }));

      setTodos(updatedTodos);
    } catch {
      setErrorMessage('Unable to updated a todo');
    } finally {
      todosToToggle.map(todo => removeProcessing(todo.id));
    }
  };

  useEffect(() => {
    if (!creating) {
      focus.current?.focus();
    }
  }, [creating, focus]);

  return (
    <header className="todoapp__header">
      {hasToggle && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: activeTodos.length === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={focus}
          value={title}
          onChange={handleTitle}
          disabled={creating}
        />
      </form>
    </header>
  );
});
