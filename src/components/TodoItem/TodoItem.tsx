import React, { useContext, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { EditInput } from '../EditInput';
import { TodosContext } from '../TodosProvider';

type Props = {
  todo: Todo,
  editedTodoId: number;
  setEditedTodoId: (todoId: number) => void;
};
export const TodoItem: React.FC<Props> = ({
  todo,
  editedTodoId,
  setEditedTodoId,
}) => {
  const [todoId, setTodoId] = useState(0);
  const {
    handleDeleteTodo,
    handleStatus,
    processedTodos,
  } = useContext(TodosContext);

  const handleDeletion = (id: number) => {
    handleDeleteTodo(id);
    setTodoId(id);
  };

  const handleDoubleClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    if (event.detail === 2) {
      setEditedTodoId(todo.id);
    }
  };

  return (
    <div
      className={cn(
        'todo',
        {
          completed: todo.completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          placeholder="Empty todo will be deleted"
          checked={todo.completed}
          onChange={() => {
            handleStatus(todo);
          }}
        />
      </label>

      {editedTodoId === todo.id
        ? (
          <EditInput
            todo={todo}
            setEditedTodoId={setEditedTodoId}
          />
        )
        : (
          <>
            <span
              aria-hidden="true"
              className="todo__title"
              onClick={handleDoubleClick}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => {
                if (todo.id) {
                  handleDeletion(todo.id);
                }
              }}
            >
              ×
            </button>
          </>
        )}
      <div
        className={cn(
          'modal overlay',
          {
            'is-active': todoId === todo.id
              || processedTodos.includes(todo),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
