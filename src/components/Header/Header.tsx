import cn from 'classnames';
import {
  Dispatch, SetStateAction, useEffect, useRef, useState,
} from 'react';
import { ErrorType } from '../../types/ErrorEnum';
import { Todo } from '../../types/Todo';

interface Props {
  isAllCompleted : boolean,
  addTodo: (title: string, userId: number) => void;
  setErrorMessage: (error: ErrorType | null) => void,
  updateTodos: (updatedTodo: Todo) => void,
  todos: Todo[],
  setLoadingIds:Dispatch<SetStateAction<number[]>>
}

export const Header:React.FC<Props> = ({
  isAllCompleted,
  addTodo,
  setErrorMessage,
  updateTodos,
  todos,
  setLoadingIds,
}) => {
  const todoInput = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const USER_ID = 12022;

  useEffect(() => {
    if (todoInput && !isLoading) {
      todoInput.current?.focus();
    }
  }, [isLoading]);

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    const preparedTitle = title.trim();

    if (!preparedTitle) {
      setErrorMessage(ErrorType.Title);

      return;
    }

    try {
      setIsLoading(true);

      await addTodo(preparedTitle, USER_ID);
    } catch (error) {
      setErrorMessage(ErrorType.AddTodo);
    } finally {
      setIsLoading(false);

      setTitle('');
    }
  };

  const toggleAll = async () => {
    if (isAllCompleted) {
      setLoadingIds(() => todos.map(todo => todo.id));
      await Promise.all(
        todos.map(todo => updateTodos({ ...todo, completed: !todo.completed })),
      );
    } else {
      setLoadingIds(
        () => todos.filter(todo => !todo.completed).map(todo => todo.id),
      );
      await Promise.all(
        todos
          .filter((todo) => !todo.completed)
          .map((todo) => updateTodos({ ...todo, completed: true })),

      );
    }

    setLoadingIds([]);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: isAllCompleted })}
        data-cy="ToggleAllButton"
        aria-labelledby="button-label"
        onClick={toggleAll}
      />

      <form
        onSubmit={submitHandler}
      >
        <input
          ref={todoInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
