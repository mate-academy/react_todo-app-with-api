import cn from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  filteredTodos: Todo[],
  deleteTodo: (todoId: number) => void,
  tempTodo: Todo | null,
  loadingTodoIds: number[],
  toggleTodoStatus: (todoId: number, completed: boolean) => void,
  saveEditedTitle: (
    todoId: number,
    todoTitle: string,
    setEditingTodoId: (value: number) => void) => void,
};

export const Main: React.FC<Props> = ({
  filteredTodos,
  deleteTodo,
  tempTodo,
  loadingTodoIds,
  toggleTodoStatus,
  saveEditedTitle,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(0);

  const editTodoTitle = (todoId: number, todoTitle: string) => {
    setEditingTodoId(todoId);
    setNewTitle(todoTitle);
  };

  const changeEditField = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleEditSubmit = (todoId: number, todoTitle: string) => {
    if (newTitle === '') {
      deleteTodo(todoId);
    }

    if (newTitle === todoTitle) {
      setEditingTodoId(0);
    }
  };

  return (
    <section className="todoapp__main">
      {filteredTodos.map(todo => (
        <div
          key={todo.id}
          className={cn(
            'todo',
            { completed: todo.completed },
          )}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onClick={() => toggleTodoStatus(todo.id, todo.completed)}
            />
          </label>

          {editingTodoId === todo.id
            ? (
              <form onSubmit={(event) => {
                event.preventDefault();
                handleEditSubmit(todo.id, todo.title);
                saveEditedTitle(todo.id, newTitle, setEditingTodoId);
              }}
              >
                <input
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={newTitle}
                  onChange={changeEditField}
                  onBlur={(event) => {
                    event.preventDefault();
                    handleEditSubmit(todo.id, todo.title);
                    saveEditedTitle(todo.id, newTitle, setEditingTodoId);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      setEditingTodoId(0);
                    }
                  }}
                />
              </form>
            )
            : (
              <>
                <span
                  className="todo__title"
                  onDoubleClick={() => editTodoTitle(todo.id, todo.title)}
                >
                  {todo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => deleteTodo(todo.id)}
                >
                  ×
                </button>
              </>
            )}
          <div
            className={cn(
              'modal overlay',
              { 'is-active': loadingTodoIds.includes(todo.id) },
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
      {/* This todo is being edited
      <div className="todo">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
          />
        </label>

        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}

      {/* This todo is in loadind state */}
      {tempTodo && (
        <div className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{tempTodo.title}</span>
          <button type="button" className="todo__remove">×</button>

          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}

    </section>
  );
};
