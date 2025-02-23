import React, {
  FC,
  Dispatch,
  useEffect,
  useRef,
  useState,
  SetStateAction,
} from 'react';
import cn from 'classnames';

import { Todo } from '../types/Todo';
import { Errors } from '../types/Errors';

import { USER_ID } from '../api/todos';

type Props = {
  todos: Todo[];
  isAddingTodo: boolean;
  errorMessage: Errors;
  setErrorMessage: Dispatch<SetStateAction<Errors>>;
  onAddTodo: (
    { title, userId, completed }: Omit<Todo, 'id'>,
    setTitle: Dispatch<SetStateAction<string>>,
  ) => void;
  onUpdateTodo: (todoToUpdate: Todo) => void;
  isLoading: boolean;
};
export const Header: FC<Props> = ({
  todos,
  setErrorMessage,
  onAddTodo,
  isAddingTodo,
  errorMessage,
  onUpdateTodo,
  isLoading,
}) => {
  const [title, setTitle] = useState('');

  const areTodosAllCompleted = todos.every(todo => todo.completed);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trimStart();

    setTitle(value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage(Errors.EMPTY_TITLE);
      inputRef.current?.focus();

      return;
    }

    onAddTodo(
      {
        title: title.trim(),
        userId: USER_ID,
        completed: false,
      },
      setTitle,
    );
  };

  const handleToggleCompletedTodos = () => {
    const completed = !areTodosAllCompleted;

    return todos
      .filter(todo => todo.completed !== completed)
      .map(todo =>
        onUpdateTodo({
          ...todo,
          completed,
        }),
      );
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, errorMessage]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && !isLoading && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: areTodosAllCompleted && todos.length > 0,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleCompletedTodos}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleInputChange}
          disabled={isAddingTodo}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
