/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Dispatch, SetStateAction, useState } from 'react';
import { TodoForm } from '../TodoForm/TodoForm';
import { TodoBody } from '../TodoBody/TodoBody';

type Props = {
  todos: Todo[];
  deleteTodo: (todoId: number) => Promise<void>;
  setTodos: (todos: Todo[]) => void;
  loadingIds: number[];
  setLoadingIds: Dispatch<SetStateAction<number[]>>;
  toggleStatus: (todoId: number) => void;
  updateTodo: (todoId: number, updatedField: Partial<Todo>) => Promise<void>;
};

export const Main: React.FC<Props> = ({
  todos,
  deleteTodo,
  loadingIds,
  setLoadingIds,
  toggleStatus,
  updateTodo,
}) => {
  const [isBeingEdited, setIsBeingEdited] = useState<Todo | null>(null);

  const handleDelete = (todoId: number) => {
    setLoadingIds(prevIds => [...prevIds, todoId]);

    return deleteTodo(todoId).finally(() => setLoadingIds([]));
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={cn('todo', { completed: todo.completed })}
          key={todo.id}
          onDoubleClick={() => setIsBeingEdited(todo)}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              onClick={() => toggleStatus(todo.id)}
              checked={todo.completed}
            />
          </label>

          {isBeingEdited === todo ? (
            <TodoForm
              todo={todo}
              setIsBeingEdited={setIsBeingEdited}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
              setLoadingIds={setLoadingIds}
            />
          ) : (
            <TodoBody todo={todo} handleDelete={handleDelete} />
          )}
          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': loadingIds.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
