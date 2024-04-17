/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TempTodo } from './TempTodo';
import { NewTodo } from './NewTodo';


type Props = {
  filteredTodos: Todo[];
  toggleTodoCompletion: (todoId: number) => void;
  deleteSingleTodo: (todoId: number) => void;
  loadingTodoIds: number[];
  tempTodo: Todo | null;
  newTodo: Todo | null;
  handleSave: (todoId: number, newTitle: string) => void;
  handleKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  loading: boolean;
  editing: boolean;
};

export const Main: React.FC<Props> = ({
  filteredTodos,
  toggleTodoCompletion,
  loadingTodoIds,
  deleteSingleTodo,
  handleSave,
  tempTodo,
  newTodo,
  handleKeyUp,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {filteredTodos.map(({ title, id, completed }) => (
        <div
          key={id}
          data-cy="Todo"
          className={classNames('todo', { completed: completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={completed}
              onChange={() => toggleTodoCompletion(id)}
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteSingleTodo(id)}
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being deleted or updated */}
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': loadingTodoIds.includes(id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && ( // Render the tempTodo if it exists
        <TempTodo todo={tempTodo} deleteSingleTodo={deleteSingleTodo} />
      )}

      {newTodo && (
        <NewTodo
          todo={newTodo}
          onSave={handleSave}
          toggleTodoCompletion={toggleTodoCompletion}
          loading={Boolean()}
          handleKeyUp={handleKeyUp}
        />
      )}
    </section>
  );
};
