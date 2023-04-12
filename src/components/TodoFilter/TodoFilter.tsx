import classNames from 'classnames';
import {
  FC,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';
import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  todos: Todo[],
  todoStatus: TodoStatus,
  setTodoStatus: Dispatch<SetStateAction<TodoStatus>>,
  numberOfRemainingTodos: number,
  onTodoDelete: (todoIds: number[]) => void;
};

export const TodoFilter: FC<Props> = ({
  todos,
  todoStatus,
  setTodoStatus,
  numberOfRemainingTodos,
  onTodoDelete,
}) => {
  const handleClearCompleted = useCallback(() => {
    const todoIds = todos.reduce((acc: number[], { id, completed }) => {
      if (completed) {
        acc.push(id);
      }

      return acc;
    }, []);

    if (todoIds.length > 0) {
      onTodoDelete(todoIds);
    }
  }, [todos]);

  const countTitle = numberOfRemainingTodos === 1
    ? 'item'
    : 'items';

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${numberOfRemainingTodos} ${countTitle} left`}
      </span>

      <nav className="filter">
        {Object.values(TodoStatus).map(status => (
          <a
            key={status}
            href={`#${status}`}
            className={classNames(
              'filter__link',
              {
                selected: todoStatus === status,
              },
            )}
            onClick={() => setTodoStatus(status)}
          >
            {status.slice(0, 1).toUpperCase() + status.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          {
            'is-invisible': todos.every(todo => !todo.completed),
          },
        )}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
