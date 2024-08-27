import classNames from 'classnames';
import { FC, FormEvent, useEffect, useRef, useState } from 'react';
import { useTodosContext } from '../../context/context';
import { Todo } from '../../types/Todo';
import { updateAllTodos } from '../../helpers/updateAllTodos';
import { ErrorMessages } from '../../enum/ErrorMessages';

interface Props {
  addTodoToTodoList: (todo: Todo) => Promise<void>;
  isLoading: boolean;
}

export const TodoForm: FC<Props> = ({ addTodoToTodoList, isLoading }) => {
  const [todoValue, setTodoValue] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const { todos, setErrorMessage, setTodoLoading, setTodos } =
    useTodosContext();

  const completedTodos = todos.filter(todo => todo.completed).length;
  const trimmedTodoValue = todoValue.trim();

  const handleToggleTodos = async () => {
    await updateAllTodos({
      todos,
      setErrorMessage,
      setTodoLoading,
      setTodos,
    });
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedTodoValue) {
      setErrorMessage(ErrorMessages.emptyTitle);

      return;
    }

    try {
      await addTodoToTodoList({
        id: 0,
        title: trimmedTodoValue,
        completed: false,
        userId: 1305,
      });

      setTodoValue('');
    } catch (error) {
    } finally {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const isButtonVisible = !isLoading && todos.length > 0;

  return (
    <header className="todoapp__header">
      {isButtonVisible && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: completedTodos === todos.length,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleTodos}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoValue}
          onChange={e => setTodoValue(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
