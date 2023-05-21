import {
  FC,
  FormEvent,
  useEffect,
  useState,
} from 'react';
import cn from 'classnames';
import { USER_ID } from '../../consts/consts';
import { Todo } from '../../types/Todo';
import { TodoError } from '../../types/TodoError';

interface Props {
  todos: Todo[];
  handleError: (message: TodoError) => void;
  setTodoId: (id: number | null) => void;
  onAddTodo: (todoData: Todo) => void;
  onToggleAllTodos: () => void;
}

export const Header: FC<Props> = ({
  todos,
  handleError,
  onAddTodo,
  onToggleAllTodos,
  setTodoId,
}) => {
  const isAllSelected = todos.every((todo) => todo.completed);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title) {
      handleError(TodoError.EMPTY_TITLE);
    }

    const tempTodo: Todo = {
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    };

    setIsInputDisabled(true);
    onAddTodo(tempTodo);
  };

  const handleToglleButton = () => {
    onToggleAllTodos();
    setTodoId(null);
  };

  useEffect(() => {
    if (isInputDisabled) {
      setIsInputDisabled(false);
      setTitle('');
    }
  }, [isInputDisabled]);

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: isAllSelected })}
        onClick={handleToglleButton}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
