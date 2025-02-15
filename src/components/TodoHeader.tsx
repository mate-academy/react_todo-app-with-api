import React, { useRef, useState } from 'react';
import { patchTodo, postTodo, USER_ID } from '../api/todos';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface Props {
  handleError: (value: string) => void;
  setTempTodo: (value: Todo | null) => void;
  setTodos: (value: (value: Todo[]) => Todo[]) => void;
  todos: Todo[];
  setErrorMessage: (value: string) => void;
}

export const TodoHeader: React.FC<Props> = ({
  handleError,
  setTempTodo,
  setTodos,
  todos,
  setErrorMessage,
}) => {
  const [inputDisabled, setInputDisabled] = useState(false);
  const [title, setTitle] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);
  const isAllTodosCompleted = todos.every(todo => todo.completed);

  titleInputRef.current?.focus();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      handleError('Title should not be empty');

      return;
    }

    setInputDisabled(true);

    setTempTodo({
      id: 0,
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    });

    postTodo({ title: title.trim(), completed: false, userId: USER_ID })
      .then(result => {
        setTodos(prev => [...prev, result]);
        setTitle('');
      })
      .catch(() => handleError('Unable to add a todo'))
      .finally(() => {
        setInputDisabled(false);
        setTempTodo(null);
      });
  };

  const handleToggleAllTodos = () => {
    let todosToToggle: Todo[] = [];

    if (isAllTodosCompleted) {
      todosToToggle = [...todos];
    } else {
      todosToToggle = [...todos].filter(todo => !todo.completed);
    }

    const toggleTasks = todosToToggle.map(todo =>
      patchTodo({ ...todo, completed: !todo.completed }),
    );

    const successfullyToggled: Todo[] = [];

    Promise.allSettled(toggleTasks).then(results => {
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          setErrorMessage('Unable to delete a todo');
        } else {
          successfullyToggled.push(todosToToggle[index]);
        }
      });
      setTodos(current =>
        current.map(todo => {
          if (successfullyToggled.includes(todo)) {
            return { ...todo, completed: !todo.completed };
          }

          return todo;
        }),
      );
    });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllTodos}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={inputDisabled}
          ref={titleInputRef}
          autoFocus
        />
      </form>
    </header>
  );
};
