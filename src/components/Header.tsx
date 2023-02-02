/* eslint-disable jsx-a11y/control-has-associated-label */

import cn from 'classnames';
import React, {
  useRef, useEffect, useState, useContext, memo,
} from 'react';
import { addTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { AuthContext } from './Auth/AuthContext';

type Props = {
  todos: Todo[],
  isAllTodosCompleted: boolean,
  setTemporaryTodo: (todo: Todo | null) => void,
  showError: (message: string) => void,
  setTodos: (prev: Todo[]) => void,
  toggleAll: () => void,
};

export const Header: React.FC<Props> = memo(({
  todos,
  isAllTodosCompleted,
  setTemporaryTodo,
  showError,
  setTodos,
  toggleAll,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const user = useContext(AuthContext);

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title) {
      const todoForBack: Omit<Todo, 'id'> = {
        userId: user?.id || 0,
        title,
        completed: false,
      };

      setTemporaryTodo({
        id: 0,
        ...todoForBack,
      });

      setIsAdding(true);

      addTodo(todoForBack)
        .then((newTodo) => {
          setTodos([...todos, newTodo]);
        })
        .catch(() => showError('Unable to add a todo'))
        .finally(() => {
          setTitle('');
          setTemporaryTodo(null);
          setIsAdding(false);
        });
    } else {
      showError('title can\'t be empty');
    }
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={cn('todoapp__toggle-all', { active: isAllTodosCompleted })}
        onClick={() => toggleAll()}
      />

      <form onSubmit={(event) => onSubmitForm(event)}>
        <input
          disabled={isAdding}
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
});
