import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isClicked: boolean,
  currentTodo: number,
  selectedTodos: number[],
  setIsClicked: (value: boolean) => void,
  setCurrentTodo: (value: number) => void,
  setTodoTitle: (value: string) => void,
  deleteTodoFromServer: (value: number) => void,
  updateTodoOnServer: (idTodo: number, data: Partial<Todo>) => void,
  setSelectedTodos: (value: number[]) => void,
};

export const TodoItem: React.FC<Props> = React.memo(
  ({
    todo,
    isClicked,
    selectedTodos,
    currentTodo,
    deleteTodoFromServer,
    setIsClicked,
    setCurrentTodo,
    updateTodoOnServer,
    setSelectedTodos,
  }) => {
    const [newTodoTitle, setNewTodoTitle] = useState('');

    const newTodoField = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (newTodoField.current) {
        newTodoField.current.focus();
      }
    }, [currentTodo]);

    const handleChangeTodoStatus = (
      todoId: number, todoStatus: boolean,
    ) => {
      updateTodoOnServer(todoId, { completed: todoStatus });
      setSelectedTodos([todoId]);
    };

    const handleEditingField = (todoId: number) => {
      setIsClicked(true);
      setCurrentTodo(todoId);
      setNewTodoTitle(todo.title);
    };

    const handleBlur = () => {
      if (todo.title === newTodoTitle) {
        setIsClicked(false);
      } else if (!newTodoTitle) {
        deleteTodoFromServer(todo.id);
      } else {
        setSelectedTodos([todo.id]);
        updateTodoOnServer(todo.id, { title: newTodoTitle });
        setIsClicked(false);
      }
    };

    const handleFinishEditing = (
      event: React.KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        setIsClicked(false);

        return;
      }

      if (event.key === 'Enter') {
        handleBlur();
      }
    };

    return (
      <div
        data-cy="Todo"
        className={classNames(
          'todo',
          { completed: todo.completed },
        )}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            defaultChecked
            onClick={() => handleChangeTodoStatus(todo.id, !todo.completed)}
          />
        </label>

        {isClicked && (currentTodo === todo.id)
          ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                ref={newTodoField}
                value={newTodoTitle}
                onKeyDown={(event) => handleFinishEditing(event)}
                onChange={(event) => setNewTodoTitle(event.target.value)}
                onBlur={handleBlur}
              />
            </form>
          )
          : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => handleEditingField(todo.id)}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={() => deleteTodoFromServer(todo.id)}
              >
                ×
              </button>
            </>
          )}

        <div
          data-cy="TodoLoader"
          className={classNames(
            'modal overlay',
            { 'is-active': selectedTodos.includes(todo.id) },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
