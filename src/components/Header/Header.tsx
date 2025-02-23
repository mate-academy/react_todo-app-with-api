import { useEffect, useRef, useState } from 'react';
import { addTodo, USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  setErrorMessage: (error: Errors) => void;
  setTempTodo: (todo: Todo | null) => void;
  setTodos: (todos: Todo[]) => void;
  handleUpdateTodo: (
    todoId: number,
    updatedData: {},
    isChangeState?: (state: boolean) => void,
  ) => void;
  isTtitleChanging: boolean;
};

export const Header = ({
  todos,
  setErrorMessage,
  setTempTodo,
  setTodos,
  handleUpdateTodo,
  isTtitleChanging,
}: Props) => {
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const isAllTodoCompleted = todos.every(todo => todo.completed);

  useEffect(() => {
    if (!isTtitleChanging) {
      input.current?.focus();
    }
  });

  const handleFormSubmmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(Errors.EMPTY_TITLE);

      return;
    }

    setIsDisabled(true);

    const newTodo = {
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ id: 0, ...newTodo });
    addTodo(newTodo)
      .then(todo => {
        setTodos([...todos, todo]);
        setTitle('');
      })
      .catch(() => setErrorMessage(Errors.CREATE))
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
        input.current?.focus();
      });
  };

  const handleToggleAllClick = () => {
    const todosToChange = isAllTodoCompleted
      ? todos
      : todos.filter(todo => !todo.completed);

    const dataToChange = todosToChange.map(todo => {
      return { id: todo.id, completed: !todo.completed };
    });

    dataToChange.forEach(todo => {
      handleUpdateTodo(todo.id, { completed: todo.completed });
    });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllTodoCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllClick}
        />
      )}

      <form onSubmit={handleFormSubmmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={title}
          disabled={isDisabled}
          ref={input}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
