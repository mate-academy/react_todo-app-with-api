/* eslint-disable max-len */
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  todos: Todo[];
  completedTodosCount: number;
  onAddTodo: (newTodo: Omit<Todo, 'id'>) => Promise<void>;
  setErrorTodos: Dispatch<SetStateAction<ErrorType>>;
  tempTodo: Todo | null;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  onUpdateToggleAll: () => void;
};

export const Header: React.FC<Props> = props => {
  const {
    todos,
    completedTodosCount,
    onAddTodo,
    setErrorTodos,
    tempTodo,
    setTempTodo,
    onUpdateToggleAll,
  } = props;

  const [todoTitle, setTodoTitle] = useState('');
  const normalizedTitle = todoTitle.trim();

  const inputNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputNameRef.current) {
      inputNameRef.current.focus();
    }
  }, [todos, tempTodo]);

  const onResetTitle = () => {
    setTodoTitle('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!normalizedTitle) {
      setErrorTodos(ErrorType.EmptyTitle);

      return;
    }

    const newTodo = {
      title: normalizedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    try {
      await onAddTodo(newTodo);
      onResetTitle();
    } catch (error) {
    } finally {
      setTempTodo(null);
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.length === completedTodosCount,
          })}
          onClick={() => onUpdateToggleAll()}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputNameRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={!!tempTodo}
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
