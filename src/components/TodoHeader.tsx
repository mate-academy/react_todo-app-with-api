/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  useContext,
  useEffect,
  useMemo,
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
    todos,
    setError,
    handleTodoAdd,
    setTempTodo,
    activeTodos,
    completedTodos,
    isLoading,
    handleToggleChange,
  } = useContext(TodoContext);
  const [title, setTitle] = useState('');

  const activeTodosCount = activeTodos.length;

  const inputField = useRef<HTMLInputElement>(null);

  const isAllCompleted = useMemo(() => (
    todos.every(el => el.completed)
  ), [todos]);

  useEffect(() => {
    if (!isLoading) {
      inputField.current?.focus();
    }
  }, [isLoading]);

  const handleToggleAll = () => {
    if (activeTodosCount) {
      activeTodos.forEach(todo => handleToggleChange(todo));
    } else {
      completedTodos.forEach(todo => handleToggleChange(todo));
    }
  };

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
        throw new Error();
      });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: isAllCompleted },
          )}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
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
