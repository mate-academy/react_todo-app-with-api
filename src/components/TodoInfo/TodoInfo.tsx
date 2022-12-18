import cn from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { NewTodo } from '../NewTodo/NewTodo';

type Props = {
  todo: Todo;
  loader: boolean;
  focusedTodoId: number;
  togglerLoader: boolean;
  clearCompletedLoader: boolean;
  onDeleteTodo: (value: number) => void;
  onUpdateTodo: (todoId: number, todo: Todo) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  onUpdateTodo,
  loader,
  clearCompletedLoader,
  togglerLoader,
  focusedTodoId,
}) => {
  const [showNewTodo, setShowNewTodo] = useState(false);
  const [clickedTodoId, setClickedTodoId] = useState<number>();

  const handleDeleteButton = () => {
    onDeleteTodo(todo.id);
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleStatusChange = async (todo: Todo) => {
    onUpdateTodo(todo.id, {
      ...todo,
      completed: !todo.completed,
    });
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={cn(
          'todo',
          { completed: todo.completed },
        )}
      >
        <label
          className="todo__status-label"
          onChange={() => handleStatusChange(todo)}
        >
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        {!showNewTodo && (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setShowNewTodo(true);
                setClickedTodoId(todo.id);
              }}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => handleDeleteButton()}
            >
              ×
            </button>
          </>
        )}

        {(showNewTodo && clickedTodoId === todo.id) && (
          <NewTodo
            onUpdateTodo={onUpdateTodo}
            onDeleteTodo={onDeleteTodo}
            currentTodo={todo}
            title={todo.title}
            onTodoShowChange={setShowNewTodo}
          />
        )}

        <div
          data-cy="TodoLoader"
          className={cn(
            'modal overlay',
            {
              'is-active': (loader && focusedTodoId === todo.id)
                || togglerLoader || clearCompletedLoader,
            },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
