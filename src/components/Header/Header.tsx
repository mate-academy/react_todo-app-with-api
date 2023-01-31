import {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { addTodo, updateTodo } from '../../api/todos';
import { ErrorType } from '../../types/ErrorType';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  onChange: (status: boolean, todoId: number | number[]) => void;
  onError: (error: ErrorType) => void;
  onAddTempTodo: (tempTodo: Todo | null) => void
  isTodosChanging: boolean;
  todos: Todo[]
};

/* eslint-disable jsx-a11y/control-has-associated-label */
export const Header: React.FC<Props> = ({
  onChange,
  onError,
  onAddTempTodo,
  isTodosChanging,
  todos,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const user = useContext(AuthContext);

  const newTodo: Todo = {
    id: 0,
    userId: (user as User).id,
    title: newTodoTitle,
    completed: false,
  };

  const togleAll = () => {
    const activeTodos = todos
      .filter(todo => todo.completed === false);

    if (!activeTodos.length) {
      const todoIds = todos.map(todo => todo.id);

      onChange(true, todoIds);
      Promise.all(todos.map(id => updateTodo(id, 'completed', false)))
        .catch(() => {
          onError(ErrorType.DELETE);
        })
        .finally(() => {
          onChange(false, todoIds);
        });

      return;
    }

    const activeTodoIds = activeTodos.map(todo => todo.id);

    onChange(true, activeTodoIds);
    Promise.all(activeTodos.map(id => updateTodo(id, 'completed', true)))
      .catch(() => {
        onError(ErrorType.DELETE);
      })
      .finally(() => {
        onChange(false, activeTodoIds);
      });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTodoTitle.length) {
      onError(ErrorType.EMPTYTITLE);
    } else {
      onChange(true, newTodo.id);
      setNewTodoTitle('');
      onAddTempTodo(newTodo);
      addTodo(newTodo)
        .catch(() => {
          onError(ErrorType.ADD);
        })
        .finally(() => {
          onChange(false, -1);
        });
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [onAddTempTodo]);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        onClick={togleAll}
        className="todoapp__toggle-all active"
      />

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={newTodoTitle}
          onChange={(event) => {
            setNewTodoTitle(event.target.value);
          }}
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isTodosChanging}
        />
      </form>
    </header>
  );
};
