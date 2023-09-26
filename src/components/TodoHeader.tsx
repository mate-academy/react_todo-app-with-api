/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { CurrentError } from '../types/CurrentError';
import { TodoContext } from '../Context/TodoContext';
import { USER_ID } from '../utils/constants';

type Props = {};

export const TodoHeader: React.FC<Props> = () => {
  const {
    setError,
    handleTodoAdd,
    setTempTodo,
    activeTodos,
    completedTodos,
    isLoading,
  } = useContext(TodoContext);
  const [title, setTitle] = useState('');
  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) {
      inputField.current?.focus();
    }
  }, [isLoading]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(CurrentError.EmptyTitleError);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo({ id: 0, ...newTodo });
    handleTodoAdd(newTodo)
      .then(() => {
        setTitle('');
      })
      .catch(() => {
        setError(CurrentError.AddError);
      });
  };

  const activeTodosCount = activeTodos.length;
  const completedTodosCount = completedTodos.length;

  return (
    <header className="todoapp__header">
      {!!activeTodosCount && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: completedTodosCount },
          )}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
