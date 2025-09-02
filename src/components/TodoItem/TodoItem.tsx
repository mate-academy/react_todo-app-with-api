import * as React from 'react';
import { Todo } from '../../types/Todo';

type TodoItemProps = {
  todo: Todo;
  tempTodoId: number | null;
  selectedTodo: Todo | null;
  setSelectedTodo: (todo: Todo | null) => void;
  handleUpdateTodo: (id: number, data: Partial<Todo>) => void;
  handleDeleteTodo: (id: number) => void;
  handleEditTodo: (todo: Todo) => void;
  processingIds: number[];
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  tempTodoId,
  selectedTodo,
  setSelectedTodo,
  handleUpdateTodo,
  handleDeleteTodo,
  handleEditTodo,
  processingIds,
}) => {
  const isEditing = selectedTodo?.id === todo.id;
  const isProcessing = processingIds.includes(todo.id);
  const isTemp = tempTodoId === todo.id;

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isTemp}
          onChange={() =>
            !isTemp && handleUpdateTodo(todo.id, { completed: !todo.completed })
          }
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleEditTodo(selectedTodo!);
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder={
              selectedTodo!.title.trim() === ''
                ? 'Empty todo will be deleted'
                : ''
            }
            value={selectedTodo!.title}
            onChange={e =>
              setSelectedTodo({ ...selectedTodo!, title: e.target.value })
            }
            onBlur={() => handleEditTodo(selectedTodo!)}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                setSelectedTodo(null);
              }
            }}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setSelectedTodo(todo)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            data-cy="TodoDelete"
            className="todo__remove"
            disabled={isTemp}
            onClick={() => !isTemp && handleDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isProcessing ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
