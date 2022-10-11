import classNames from 'classnames';
import React, { FormEvent, useCallback, useEffect } from 'react';
import { addTodo } from '../../api/todos';
import { ErrorMessage } from '../../types/Error';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  handleAllCompleted: () => void;
  todos: Todo[];
  isAdding: boolean;
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const Header: React.FC<Props> = ({
  newTodoField,
  setTitle,
  title,
  handleAllCompleted,
  todos,
  isAdding,
  setIsAdding,
  user,
  setErrorMessage,
  setTodos,
}) => {
  const getValue = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(value);
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  const newTodo = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !user) {
      setErrorMessage(ErrorMessage.ErrorTitle);

      return;
    }

    setIsAdding(true);

    try {
      const postTodo = await addTodo(title, user.id);

      setTodos((prevTodos) => [...prevTodos, postTodo]);
    } catch {
      setErrorMessage(ErrorMessage.NotAdd);
    }

    setIsAdding(false);
    setTitle('');
  }, [title, user]);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={
          classNames(
            'todoapp__toggle-all',
            { active: todos.every(todo => todo.completed) },
          )
        }
        aria-label="close"
        onClick={handleAllCompleted}
      />

      <form
        onSubmit={newTodo}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={getValue}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
