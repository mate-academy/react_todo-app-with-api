import { FormEvent, useState } from 'react';
import cn from 'classnames';
import { TContext, useTodoContext } from './TodoContext';
import { Todo } from '../types/Todo';
import { deleteTodo, editTodo, getTodos } from '../api/todos';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [toggledId, setToggledId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isLoading, setIsLoading] = useState(false);
  const [editedTodo, setIsEditedTodo] = useState<Todo | null>(null);

  const {
    todos,
    setTodos,
    handleError,
    // tempTodos,
    // idTemp,
    handleToggleStatus,
    isToggled,
    isToggledAll,
    titleInputRef,
  } = useTodoContext() as TContext;

  const USER_ID = 11550;

  const handleDelete = (todoId: number) => {
    setIsDeleting(true);

    return deleteTodo(todoId)
      .then(() => getTodos(USER_ID))
      .then((res) => {
        setTodos(res);
        setIsDeleting(false);
      })
      .catch(() => {
        handleError('Unable to delete a todo');
      })
      .finally(() => {
        titleInputRef.current?.focus();
      });
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
      // Anuluj edycję
      setIsEditing(false);
      setIsLoading(false);

      return;
    }

    if (newTitle.trim() === '') {
      // Usuń zadanie
      await handleDelete(todo.id);

      return;
    }

    setIsLoading(true);
    // Wyślij żądanie do API w celu zapisania zmiany tytułu
    const updatedTodoWithNewTitle = { ...todo, title: newTitle };

    const updatedTodoIndex = todos
      .findIndex((editedtodo) => editedtodo.id === todoId);

    // Obsłuż sukces lub błąd
    if (editedTodo !== null) {
      editTodo(todoId, updatedTodoWithNewTitle)
        .then((res) => {
        // Skopiuj tablicę todos
          const updatedTodos = [...todos];

          // Zaktualizuj tylko jeden element w tablicy
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
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={() => {
                handleSaveChanges(todo.id);
              }}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSaveChanges(todo.id);
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
            onClick={() => handleDelete(todo?.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay',
          {
            'is-active': (isDeleting === true)
          || (todo.id === 0) || (isToggled && todo.id === toggledId)
          || (isToggledAll) || (isLoading),
          })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>

  );
};
