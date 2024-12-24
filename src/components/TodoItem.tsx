/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodoLoader } from './TodoLoader';

type Props = {
  todo: Todo;
  togglCompleted: (todoId: number) => void;
  editingTodoId: number | null;
  editingTitle: string;
  setEditingTitle: React.Dispatch<React.SetStateAction<string>>;
  updateTitle: (todoId: number) => void;
  handleCancelEdit: () => void;
  loadingTodoId: number | null;
  handleEditTodo: (todoId: number, title: string) => void;
  deletePost: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  togglCompleted,
  editingTodoId,
  editingTitle,
  setEditingTitle,
  updateTitle,
  handleCancelEdit,
  loadingTodoId,
  handleEditTodo,
  deletePost,
}) => {
  return (
    <div
      data-cy="Todo"
      className={cn('todo', todo.completed && 'completed')}
      key={todo.id}
    >
      <label
        className="todo__status-label"
        onClick={() => togglCompleted(todo.id)}
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>
      {editingTodoId === todo.id ? (
        <>
          <form onSubmit={event => event.preventDefault()}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editingTitle}
              onChange={event => setEditingTitle(event.target.value)}
              onBlur={() => updateTitle(todo.id)}
              onKeyUp={event => {
                if (event.key === 'Enter') {
                  updateTitle(todo.id);
                } else if (event.key === 'Escape') {
                  handleCancelEdit();
                }
              }}
              autoFocus
            />
          </form>
          <TodoLoader
            todo={todo}
            loadingTodoId={loadingTodoId === todo.id ? loadingTodoId : null}
          />
        </>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleEditTodo(todo.id, todo.title)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deletePost(todo.id)}
          >
            ×
          </button>
          <TodoLoader todo={todo} loadingTodoId={loadingTodoId} />
        </>
      )}
    </div>
  );
};
