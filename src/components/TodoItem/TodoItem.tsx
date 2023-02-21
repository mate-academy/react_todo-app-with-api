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
export const TodoItem: React.FC<Props> = (
  {
    todo,
    editedTodoId,
    setEditedTodoId,
  },
) => {
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

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      className={cn(
        'todo',
        {
          completed: todo.completed,
        },
      )}
      onClick={(event) => {
        if (event.detail === 2) {
          setEditedTodoId(todo.id);
        }
      }}
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
            <span className="todo__title">{todo.title}</span>
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
