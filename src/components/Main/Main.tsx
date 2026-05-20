/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todosLength: number;
  filteredTodos: Todo[];
  updatingTodosId: number[];
  onDeleteTodo: (id: number) => Promise<void>;
  editingTodoId: number;
  tempTodoId: number;
  onSetEditingTodoId: React.Dispatch<React.SetStateAction<number>>;
  editingTodoInput: React.RefObject<HTMLInputElement>;
  onToggleTodo: (id: number) => Promise<void>;
  onEditTodo: (id: number, title: string) => Promise<void>;
};

export const Main: React.FC<Props> = ({
  todosLength,
  filteredTodos,
  updatingTodosId,
  onDeleteTodo,
  onSetEditingTodoId,
  editingTodoId,
  tempTodoId,
  editingTodoInput,
  onToggleTodo,
  onEditTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {!!todosLength &&
        filteredTodos.map(todo => (
          <div
            key={todo.id}
            data-cy="Todo"
            className={cn('todo', todo.completed && 'completed')}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => {
                  onToggleTodo(todo.id);
                }}
              />
            </label>

            {editingTodoId === todo.id && tempTodoId !== todo.id ? (
              <form
                onBlur={() => onEditTodo(todo.id, todo.title)}
                onSubmit={e => {
                  e.preventDefault();
                  onEditTodo(todo.id, todo.title);
                }}
              >
                <input
                  onKeyDown={e => e.key === 'Escape' && e.currentTarget.blur()}
                  ref={editingTodoInput}
                  onBlur={() => {
                    onSetEditingTodoId(0);
                  }}
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  defaultValue={todo.title}
                />
              </form>
            ) : (
              <>
                <span
                  onDoubleClick={() => {
                    onSetEditingTodoId(todo.id);
                  }}
                  data-cy="TodoTitle"
                  className="todo__title"
                >
                  {todo.title}
                </span>
                <button
                  onClick={() => {
                    onDeleteTodo(todo.id);
                  }}
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                >
                  ×
                </button>
              </>
            )}

            <div
              data-cy="TodoLoader"
              className={cn(
                'modal',
                'overlay',
                updatingTodosId.includes(todo.id) && 'is-active',
              )}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))}
    </section>
  );
};
