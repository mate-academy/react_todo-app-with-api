import React, { useEffect, useRef, useState } from 'react';
import { useTodos } from '../utils/TodoContext';
import { USER_ID } from '../api/todos';
import classNames from 'classnames';
import { ErrText } from '../types/ErrText';

export const TodoHeader: React.FC = () => {
  const {
    todos,
    onAdd,
    setErrMessage,
    loading,
    setLoading,
    toggleAllCompleted,
  } = useTodos();
  const [todoInput, setTodoInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isAllCompleted = todos.every(todo => todo.completed);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading, submitting, onAdd]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMessage(ErrText.NoErr);
    setLoading(true);
    setSubmitting(true);
    const trimmedInput = todoInput.trim();

    try {
      if (!trimmedInput.length) {
        setErrMessage(ErrText.EmptyErr);
        setTimeout(() => setErrMessage(ErrText.NoErr), 3000);
        setTodoInput('');

        return;
      }

      await onAdd({
        id: Date.now(),
        title: trimmedInput,
        completed: false,
        userId: USER_ID,
      });
      setTodoInput('');
      setSubmitting(false);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => toggleAllCompleted()}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoInput}
          onChange={e => setTodoInput(e.target.value)}
          ref={inputRef}
          disabled={submitting || loading}
        />
      </form>
    </header>
  );
};
