import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
  isLoadingId: number | null;
  updateTodo: (updatedTodo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos, onDelete = () => {}, tempTodo, isLoadingId, updateTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <div
          key={todo.id}
          className={classNames('todo', {
            completed: todo.completed === true,
          })}
        >
          <TodoItem
            todo={todo}
            onDelete={onDelete}
            isLoadingId={isLoadingId}
            updateTodo={updateTodo}
          />
        </div>
      ))}

      {tempTodo && (
        <div className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{tempTodo.title}</span>
          <button type="button" className="todo__remove">×</button>

          <div className={classNames(
            'modal overlay',
            { 'is-active': isLoadingId === tempTodo.id },
          )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>

  );
};
