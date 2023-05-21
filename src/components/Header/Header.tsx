import {
  FC,
  FormEvent,
  useEffect,
  useState,
} from 'react';
import cn from 'classnames';
import { TodoError } from '../../types/TodoError';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../consts/consts';

interface Props {
  title: string;
  setTitle: (title: string) => void;
  onAddTodo: (todo: Todo) => void;
  onError: (message: TodoError) => void;
  onToogleAllTodos: (completed: boolean) => void;
}

export const Header: FC<Props> = ({
  title,
  onAddTodo,
  onError,
  setTitle,
  onToogleAllTodos,
}) => {
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isToggleAll, setIsToggleAll] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      onError(TodoError.EMPTY_TITLE);

      return;
    }

    const tempTodo: Todo = {
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    };

    setIsInputDisabled(true);
    onAddTodo(tempTodo);
    setIsInputDisabled(false);
    setTitle('');
  };

  const handleToggler = () => {
    setIsToggleAll(!isToggleAll);
    onToogleAllTodos(isToggleAll);
  };

  useEffect(() => {
    if (isInputDisabled) {
      setTitle('');
      setIsInputDisabled(false);
    }
  }, [isInputDisabled]);

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        // className="todoapp__toggle-all active"
        className={cn('todoapp__toggle-all', { active: isToggleAll })}
        onClick={handleToggler}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
