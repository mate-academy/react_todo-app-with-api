import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoErrorType } from '../../types/TodoErrorType';
import { updateTodoStatus, updateTodoTitle } from '../../api/todos';

type Props = {
  todos: Todo[];
  setHasError: (error: TodoErrorType) => void;
  setTodosFromServer: React.Dispatch<React.SetStateAction<Todo[]>>;
  handleDeleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  loadingIds: number[];
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>
};

export const TodoMain: React.FC<Props> = ({
  todos,
  setHasError,
  handleDeleteTodo,
  tempTodo,
  setTodosFromServer,
  loadingIds,
  setLoadingIds,
}) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editedTodoTitle, setEditedTodoTitle] = useState<string>('');

  const handleToggleTodo = (todo: Todo) => {
    if (loadingIds.includes(todo.id)) {
      return;
    }

    setLoadingIds((ids) => [...ids, todo.id]);
    const updatedTodo = updateTodoStatus(todo.id, !todo.completed);

    updatedTodo
      .then((updatedTodoData) => {
        setHasError(TodoErrorType.noError);
        setEditedTodoTitle('');

        setTodosFromServer((prevTodos: Todo[]): Todo[] => prevTodos.map((
          prevTodo,
        ) => {
          return prevTodo.id === updatedTodoData.id
            ? updatedTodoData
            : prevTodo;
        }));
      })
      .catch(() => {
        setHasError(TodoErrorType.updateTodoError);
      })
      .finally(() => {
        setLoadingIds((ids) => ids.filter((id) => id !== todo.id));
      });
  };

  const handleSaveTodoTitle = (todo: Todo) => {
    if (loadingIds.includes(todo.id)) {
      return;
    }

    setLoadingIds((ids) => [...ids, todo.id]);

    const isEditedTodoTitleEmpty = editedTodoTitle.trim() === '';
    const isTitleChanged = editedTodoTitle !== todo.title;

    if (isEditedTodoTitleEmpty) {
      handleDeleteTodo(todo.id);
    } else if (isTitleChanged) {
      const updatedTodo = updateTodoTitle(todo.id, { title: editedTodoTitle });

      updatedTodo
        .then((updatedTodoData: Todo) => {
          setTodosFromServer((prevTodos: Todo[]): Todo[] => prevTodos.map((
            prevTodo,
          ) => (prevTodo.id === updatedTodoData.id
            ? updatedTodoData
            : prevTodo) as Todo));
          setHasError(TodoErrorType.noError);
          setEditingTodoId(null);
        })
        .catch(() => {
          setHasError(TodoErrorType.updateTodoError);
        })
        .finally(() => {
          setLoadingIds((ids) => ids.filter((id) => id !== todo.id));
        });
    } else {
      setHasError(TodoErrorType.noError);
      setEditingTodoId(null);
      setLoadingIds((ids) => ids.filter((id) => id !== todo.id));
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent, todo: Todo) => {
    if (e.key === 'Enter') {
      handleSaveTodoTitle(todo);
    } else if (e.key === 'Escape') {
      setEditedTodoTitle(todo.title);
      setEditingTodoId(null);
      setEditedTodoTitle(todo.title);
    }
  };

  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={classNames('todo', {
            completed: todo.completed,
            editing: editingTodoId === todo.id,
          })}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo)}
            />
          </label>

          <span
            className="todo__title"
            onDoubleClick={() => {
              if (editingTodoId === null) {
                setEditedTodoTitle(todo.title);
                setEditingTodoId(todo.id);
              }
            }}
          >
            {editingTodoId === todo.id ? (
              <input
                type="text"
                className="todo__title-field"
                value={editedTodoTitle}
                onChange={(e) => setEditedTodoTitle(e.target.value)}
                onBlur={() => handleSaveTodoTitle(todo)}
                onKeyUp={(e) => handleKeyUp(e, todo)}
              />
            ) : (
              todo.title
            )}
          </span>

          {editingTodoId === todo.id ? null : (
            <button
              type="button"
              className="todo__remove"
              onClick={() => handleDeleteTodo(todo.id)}
            >
              ×
            </button>
          )}

          {loadingIds.includes(todo.id) && (
            <div className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </div>
      ))}
      {tempTodo && (
        <div className="todo">
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              disabled
            />
          </label>

          <span className="todo__title">{tempTodo.title}</span>

          <button type="button" className="todo__remove" disabled>
            ×
          </button>
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
