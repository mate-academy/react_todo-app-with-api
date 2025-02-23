/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import classNames from 'classnames';
type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isLoading: boolean;
  handleDeleteTodo: (id: number) => void;
  handleUpdateTodo: (id: number, currentStatus: boolean) => void;
  isCompletedTodo: number[];
  setErrorMessage: (value: string) => void;
  setArrayById: (id: number, newTitle: string) => void;
};

export const TodoMain: React.FC<Props> = ({
  todos,
  isLoading,
  tempTodo,
  handleDeleteTodo,
  handleUpdateTodo,
  isCompletedTodo,
  setErrorMessage,
  setArrayById,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleUpdateTodo={handleUpdateTodo}
          handleDeleteTodo={handleDeleteTodo}
          isLoading={isLoading}
          isCompletedTodo={isCompletedTodo}
          setErrorMessage={setErrorMessage}
          setArrayById={setArrayById}
        />
      ))}
      {tempTodo && (
        <div
          data-cy="Todo"
          className={classNames('todo', tempTodo.completed && 'completed')}
          key={tempTodo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          {/* overlay will cover the todo while it is being deleted or updated */}
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': isLoading && tempTodo,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
