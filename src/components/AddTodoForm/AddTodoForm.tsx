/* eslint-disable react/button-has-type */
import {
  ChangeEvent, FormEvent, useEffect, useRef, useState,
} from 'react';
import { useAuthContext, useTodos } from '../../context';
import { ErrorType } from '../../types';

export const AddTodoForm = () => {
  const [title, setTitle] = useState<string>('');
  const {
    addTodoToServer, loadingTodos, setErrors, todos,
  } = useTodos();
  const userId = useAuthContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event : ChangeEvent<HTMLInputElement>) => {
    const titleFromInput = event.target.value;

    setTitle(titleFromInput);
  };

  useEffect(() => {
    if (inputRef.current && !inputRef.current.disabled) {
      inputRef.current.focus();
    }
  }, [todos]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTodo = {
      userId,
      title: title?.trim(),
      completed: false,
    };

    if (!title?.trim()) {
      setErrors(ErrorType.TITLE);

      return;
    }

    if (userId) {
      const success = await addTodoToServer(newTodo);

      if (success) {
        setTitle('');
      }
    }
  };

  const isloadingTodos = loadingTodos.includes(0);

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={inputRef}
        value={title}
        disabled={isloadingTodos}
        onChange={handleChange}
      />
    </form>
  );
};
