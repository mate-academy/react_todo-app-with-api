import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { ErrorType } from '../../types/ErrorEnum';
import { Todo } from '../../types/Todo';

interface Props {
  isAllCompleted : boolean,
  addTodo: (title: string, userId: number) => void;
  setErrorMessage: (error: ErrorType | null) => void,
  updateTodos: (updatedTodo: Todo) => void,
  todos: Todo[],
}

export const Header:React.FC<Props> = ({
  isAllCompleted,
  addTodo,
  setErrorMessage,
  updateTodos,
  todos,
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
      setErrorMessage(ErrorType.Todo);
    } finally {
      setIsLoading(false);

      setTitle('');
    }
  };

  const toggleAll = () => {
    if (isAllCompleted) {
      todos.forEach((todo) => updateTodos(
        { ...todo, completed: !todo.completed },
      ));
    } else {
      todos
        .filter((todo) => !todo.completed)
        .forEach((todo) => updateTodos({ ...todo, completed: true }));
    }
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
