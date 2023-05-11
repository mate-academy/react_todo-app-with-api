import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  todos: Todo[],
  isInputDisabled: boolean,
  isNewTodoAdded: boolean,
  setIsNewTodoAdded:React.Dispatch<React.SetStateAction<boolean>>,
  setHasError: React.Dispatch<React.SetStateAction<ErrorType>>,
  onTodoAdd: (userId: number, title: string) => void,
  onChange: (todoId: number, data: {
    completed?: boolean,
    title?: string,
  }) => void,
};

const USER_ID = 9955;

export const TodoHeader: React.FC<Props> = React.memo(({
  todos,
  isInputDisabled,
  isNewTodoAdded,
  setIsNewTodoAdded,
  setHasError,
  onTodoAdd,
  onChange,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const isAllTodosActive = todos.every(todo => todo.completed === true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNewTodoAdded) {
      inputRef.current?.focus();
      setIsNewTodoAdded(false);
    }
  }, [isNewTodoAdded]);

  const handleClick = () => {
    const notCompletedTodos = todos.filter(todo => todo.completed !== true);

    if (isAllTodosActive) {
      return todos.forEach(todo => (
        onChange(todo.id, { completed: !todo.completed })
      ));
    }

    return notCompletedTodos.forEach(todo => (
      onChange(todo.id, { completed: !todo.completed })
    ));
  };

  const hanldeSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      setHasError(ErrorType.Title);

      return;
    }

    onTodoAdd(USER_ID, todoTitle);
    setTodoTitle('');
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => (
    setTodoTitle(event.target.value)
  );

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          aria-label="toggle-all"
          className={classNames('todoapp__toggle-all', {
            active: isAllTodosActive,
          })}
          onClick={handleClick}
        />
      )}

      <form onSubmit={hanldeSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={todoTitle}
          onChange={handleChange}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
});
