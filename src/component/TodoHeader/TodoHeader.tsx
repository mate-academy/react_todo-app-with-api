import React, { useEffect, useRef, useState } from 'react';
import { createTodo, USER_ID } from '../../api/todos';
import { Errors, Todo } from '../../types/Todo';
import cls from 'classnames';

export interface TodoHeaderProps {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setInputRefTarget: React.Dispatch<
    React.SetStateAction<HTMLInputElement | null>
  >;
  inputRefTarget: HTMLInputElement | null;
  handleError: (type: Errors) => void;
  error: string;
  updateAllTodo: () => void;
  allCompleted: boolean;
  todos: Todo[];
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  setTodos,
  setTempTodo,
  setIsLoading,
  isLoading,
  setInputRefTarget,
  inputRefTarget,
  handleError,
  updateAllTodo,
  allCompleted,
  todos,
  error,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const format_title = title.trim();
    event.preventDefault();
    if (!format_title) {
      handleError(Errors.TitleError);
      return;
    }
    addPost();
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      setInputRefTarget(inputRef.current);
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    inputRefTarget?.focus();
  }, [title, error]);

  const addPost = () => {
    const formattedTitle = title.trim();

    const newTempTodo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };
    setTempTodo(newTempTodo);
    setIsLoading(true);

    const newTodo: Omit<Todo, 'id'> = {
      title: formattedTitle,
      userId: USER_ID,
      completed: false,
    };

    createTodo(newTodo)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setTitle('');
        inputRefTarget?.focus();
      })
      .catch(() => {
        handleError(Errors.AddTodoError);
        inputRefTarget?.focus();
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cls('todoapp__toggle-all ', { active: allCompleted })}
          data-cy="ToggleAllButton"
          onClick={updateAllTodo}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit} onReset={() => setTitle('')}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleTitleChange}
          ref={inputRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
