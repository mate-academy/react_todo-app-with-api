/* eslint-disable no-param-reassign */
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { wait } from '../../utils/fetchClient';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onSubmit: (title: string) => Promise<void>;
  setErrorMessage: (value: string) => void;
  updateTodo: (todo: Todo) => Promise<void>;
  setTempArray: (todo: Todo) => void;
  edit: boolean;
};

export const TodoForm: React.FC<Props> = ({
  onSubmit,
  setErrorMessage,
  todos,
  updateTodo,
  setTempArray,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleField = useRef<HTMLInputElement>(null);
  const allCompleted = todos.every(({ completed }) => completed);

  useEffect(() => {
    titleField.current?.focus();
  }, [title, isSubmitting, todos]);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Title should not be empty');
      wait(3000).then(() => setErrorMessage(''));
    }

    if (title.trim()) {
      setIsSubmitting(true);
      onSubmit(title.trim())
        .then(() => {
          setTitle('');
        })
        .catch(() => setTitle(title))
        .finally(() => setIsSubmitting(false));
    }
  };

  const handleToggleAllTodo = () => {
    // проблема
    todos.forEach(currentTodo => {
      if (!currentTodo.completed) {
        const newTodo = {
          ...currentTodo,
          completed: (currentTodo.completed = true),
        };

        setTempArray(currentTodo);

        updateTodo(newTodo);
      }
    });

    if (allCompleted) {
      todos.forEach(currentTodo => {
        setTempArray(currentTodo);

        const newTodo = {
          ...currentTodo,
          completed: (currentTodo.completed = false),
        };

        updateTodo(newTodo);
      });
    }
  };

  return (
    <>
      {/* this button should have `active` class only if all todos are completed */}
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllTodo}
        />
      )}
      <form onSubmit={handleFormSubmit}>
        <input
          value={title}
          ref={titleField}
          autoFocus
          disabled={isSubmitting}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleTitleChange}
        />
      </form>
    </>
  );
};
