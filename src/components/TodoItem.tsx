import { FormEvent, useEffect, useState } from 'react';
import cn from 'classnames';
import { TContext, useTodoContext } from '../context/TodoContext';
import { Todo } from '../types/Todo';
import { editTodo } from '../api/todos';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [toggledId, setToggledId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isLoading, setIsLoading] = useState(false);
  const [editedTodo, setIsEditedTodo] = useState<Todo | null>(null);
  const [deletedId, setDeletedId] = useState<number | null>(null);

  const {
    todos,
    setTodos,
    handleError,
    handleToggleStatus,
    isToggled,
    isToggledAll,
    titleInputRef,
    isGroupDeleting,
    editedRef,
    isDeleting,
    handleDelete,

  } = useTodoContext() as TContext;

  useEffect(() => {
    if (isEditing) {
      editedRef.current?.focus();
    }
  }, [isEditing]);

  const isActiveConditions
  = (isDeleting && (deletedId === todo.id))
  || (todo.id === 0)
  || (isToggled && todo.id === toggledId)
  || (isToggledAll)
  || (isLoading)
  || ((todo.completed) && isGroupDeleting);

  const doHandleDelete = (todoId: number) => {
    handleDelete(todoId);
    setTimeout(() => setDeletedId(null), 500);
  };

  const handleStatusChange = (todoId: number) => {
    handleToggleStatus(todoId);
    setToggledId(todoId);
    setTimeout(() => setToggledId(null), 500);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  const handleSaveChanges = async (todoId: number) => {
    if (newTitle === todo.title) {
      setIsEditing(false);
      setIsLoading(false);
      titleInputRef.current?.focus();

      return;
    }

    if (newTitle.trim() === '') {
      setDeletedId(todo.id);
      await doHandleDelete(todo.id);
      setTimeout(() => setDeletedId(null), 500);

      return;
    }

    setIsLoading(true);
    const updatedTodoWithNewTitle = { ...todo, title: newTitle };

    const updatedTodoIndex = todos
      .findIndex((editedtodo) => editedtodo.id === todoId);

    if (editedTodo !== null) {
      editTodo(todoId, { title: updatedTodoWithNewTitle.title })
        .then((res) => {
          const updatedTodos = [...todos];

          updatedTodos[updatedTodoIndex] = res;

          setTodos(updatedTodos);
        })
        .catch((error) => {
          handleError('Unable to update a todo');
          // eslint-disable-next-line no-console
          console.log(error);
        })
        .finally(() => {
          setIsEditing(false);
          setIsLoading(false);
          titleInputRef.current?.focus();
        });
    }
  };

  return (
    <div data-cy="Todo" className={`${todo?.completed ? 'todo completed' : 'todo'}`} key={todo?.id}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo?.completed}
          onChange={() => handleStatusChange(todo?.id)}
        />
      </label>

      {isEditing ? (
        <>
          <form
            onSubmit={(e) => handleSubmit(e)}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              ref={editedRef}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={() => {
                handleSaveChanges(todo.id);
              }}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSaveChanges(todo.id);
                }

                if (e.key === 'Escape') {
                  e.preventDefault();
                  setIsEditing(false);
                  setNewTitle(todo.title);
                }
              }}
            />
          </form>
        </>

      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditing(true);
              setIsEditedTodo(todo);
            }}
          >
            {todo?.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              setDeletedId(todo?.id);
              doHandleDelete(todo?.id);
            }}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay',
          {
            'is-active': isActiveConditions,
          })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>

  );
};
