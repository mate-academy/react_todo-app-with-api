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
    setTempTodo,
    setModifiedTodoId,
  } = useTodos();
  const [todoInput, setTodoInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isAllCompleted = todos.every(todo => todo.completed);
  const inputRefHeader = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!loading) {
      inputRefHeader.current?.focus();
    }
  }, [loading, submitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMessage(ErrText.NoErr);
    setLoading(true);
    setSubmitting(true);
    const trimmedInput = todoInput.trim();

    if (!trimmedInput.length) {
      setErrMessage(ErrText.EmptyErr);
      setTimeout(() => setErrMessage(ErrText.NoErr), 3000);
      setLoading(false);
      setSubmitting(false);

      return;
    }

    const newTodo = {
      id: Date.now(),
      title: trimmedInput,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);
    setModifiedTodoId(prev => [...prev, newTodo.id]);

    try {
      await onAdd(newTodo);
      setTodoInput('');
    } catch (error) {
      setErrMessage(ErrText.AddErr);
      setTimeout(() => setErrMessage(ErrText.NoErr), 3000);
    } finally {
      setLoading(false);
      setSubmitting(false);
      setModifiedTodoId(prev => prev.filter(todoId => todoId !== newTodo.id));
      setTempTodo(null);
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
          ref={inputRefHeader}
          disabled={submitting || loading}
        />
      </form>
    </header>
  );
};
