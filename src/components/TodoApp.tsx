import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { UpdateTodo } from '../types/UpdateTodo';
import { EditingForm } from './EditingForm';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  handleDeletingTodo: (todoId: number) => void;
  isLoading: boolean;
  handleUpdatingTodo: (todoId: number, args: UpdateTodo) => void;
  loadingTodoId: number[];
}

export const TodoApp: React.FC<Props> = ({
  todos,
  tempTodo,
  handleDeletingTodo,
  isLoading,
  handleUpdatingTodo,
  loadingTodoId,
}) => {
  const [editedTodoId, setEditedTodoId] = useState<number>(0);

  const handleDoubleClick = (todoId: number) => {
    setEditedTodoId(todoId);
  };

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <div
          className={classNames('todo', { completed: todo.completed })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              onChange={() => todo.completed}
              onClick={() => handleUpdatingTodo(
                todo.id, { completed: !todo.completed },
              )}
            />
          </label>

          {editedTodoId === todo.id
            ? (
              <EditingForm
                editedTodoId={todo.id}
                currentTodoTitle={todo.title}
                setEditedTodoId={setEditedTodoId}
                handleUpdatingTodo={handleUpdatingTodo}
                handleDeletingTodo={handleDeletingTodo}
              />
            )
            : (
              <>
                <span
                  className="todo__title"
                  onDoubleClick={() => handleDoubleClick(todo.id)}
                >
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => handleDeletingTodo(todo.id)}
                >
                  ×
                </button>
              </>
            )}

          <div className={classNames(
            'modal overlay',
            {
              'is-active': loadingTodoId.includes(todo.id) && isLoading,
            },
          )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && <TodoItem tempTodo={tempTodo} /> }
    </section>
  );
};
