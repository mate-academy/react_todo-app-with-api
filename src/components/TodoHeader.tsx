import React, { RefObject, useContext, useState } from 'react';
import * as postServise from '../api/todos';
import { TodosContext } from './TodoProvider';
import { Errors } from '../types/Errors';

type Props = {
  handleChangeInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string,
  inputRef: RefObject<HTMLInputElement>;
  setTitle: (valu: string) => void,
};

export const TodoHeader: React.FC<Props> = ({
  handleChangeInput,
  title,
  inputRef,
  setTitle,
}) => {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const {
    todos,
    setTodos,
    setError,
    USER_ID,
  } = useContext(TodosContext);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(Errors.ERRORS_EMPTY_TITLE);

      return;
    }

    setIsSubmiting(true);

    try {
      const newTodo = await postServise.createTodo({
        completed: false,
        title: title.trim(),
        userId: USER_ID,
      });

      setTodos(currentTodo => [...currentTodo, newTodo]);
      setTitle('');
    } catch (newError) {
      setError(Errors.UNABLE_ADD);
      throw newError;
    } finally {
      if (inputRef.current) {
        inputRef.current.focus();
      }

      setIsSubmiting(false);
    }
  };

  const toggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);

    await Promise.all(todos.map(async (todo) => {
      try {
        await postServise.updateTodo({
          todo: { ...todo, completed: !allCompleted },
          todoId: todo.id,
        });
      } catch (updateError) {
        setError(Errors.UNABLE_UPDATE);
      }
    }));

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    setTodos(updatedTodos);
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="toggle"
        type="button"
        className="todoapp__toggle-all"
        data-cy="ToggleAllButton"
        onClick={toggleAll}
      />

      <form onSubmit={handleFormSubmit}>
        <input
          ref={inputRef}
          disabled={isSubmiting}
          data-cy="NewTodoField"
          value={title}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleChangeInput}
        />
      </form>
    </header>
  );
};
