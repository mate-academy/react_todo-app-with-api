/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { memo, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  preparedTodos: Todo[],
  setError: React.Dispatch<React.SetStateAction<ErrorType>>,
  addNewTodo: (value: string) => Promise<void>,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  updateCurrentTodo: (
    todo: Todo,
    title: string,
    completed?: boolean
  ) => Promise<void>,
  setOnChangeIds: React.Dispatch<React.SetStateAction<number[] | null>>,
};

export const Header: React.FC<Props> = memo(({
  preparedTodos,
  setError,
  addNewTodo,
  setTempTodo,
  updateCurrentTodo,
  setOnChangeIds,
}) => {
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    inputRef.current?.focus();

    if (!value.trim().length) {
      setError(ErrorType.EMPTY);
      setTimeout(() => setError(ErrorType.NONE), 3000);

      return;
    }

    setIsSubmitting(true);
    addNewTodo(value.trim())
      .then(() => setValue(''))
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  const handleClick = () => {
    const isChecked = preparedTodos.some(todo => !todo.completed);

    const idsToUpdate: number[] = [];

    preparedTodos.forEach(todo => {
      if (todo.completed !== isChecked) {
        idsToUpdate.push(todo.id);
      }

      setOnChangeIds([...idsToUpdate]);
      idsToUpdate.forEach(id => {
        updateCurrentTodo(todo, todo.title, isChecked)
          .finally(() => {
            setOnChangeIds(currentIds => {
              const filteredIds = currentIds?.filter(filteredId => (
                filteredId !== id
              ));

              if (!filteredIds) {
                return null;
              }

              return [...filteredIds];
            });
          });
      });
    });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: preparedTodos.every(todo => todo.completed),
        })}
        onClick={handleClick}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={isSubmitting}
          ref={inputRef}
        />
      </form>
    </header>
  );
});
