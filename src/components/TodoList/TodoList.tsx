/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { errorType } from '../../types/ErrorType';
import { useRef } from 'react';
import { updateTitleTodo } from '../../api/todos';

type Props = {
  filteredTodos: Todo[];
  handleCompleted: (id: number) => void;
  tempTodo: Todo | null;
  deleteTask: (id: number) => void;
  deletingIds: number[];
  onUpdate: number[];
  setNewTitle: (title: string) => void;
  newTitle: string;
  handleError: (error: string) => void;
  setTasks: (tasks: Todo[]) => void;
  setErrorMessage: (error: string) => void;
  tasks: Todo[];
  setIsUpdating: (ids: number[]) => void;
  IsSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  canEdit: boolean;
  setCanEdit: (canEdit: boolean) => void;
};

export const TodoList = ({
  filteredTodos,
  handleCompleted,
  tempTodo,
  deleteTask,
  deletingIds,
  onUpdate,
  setNewTitle,
  newTitle,
  handleError,
  setTasks,
  setErrorMessage,
  tasks,
  setIsUpdating,
  IsSubmitting,
  setIsSubmitting,
  canEdit,
  setCanEdit,
}: Props) => {
  const editRef = useRef<number | null>(null);

  const updateNewTitle = (id: number, newTitl: string) => {
    const updateTitle = newTitl.trim();
    const todoToUpdate = tasks.find(todo => todo.id === id);

    if (!todoToUpdate) {
      setErrorMessage(errorType.found);

      return;
    }

    if (todoToUpdate.title === updateTitle) {
      return;
    }

    const updatedTodo = { ...todoToUpdate, title: updateTitle };

    const updatedTasks = tasks.map(todo =>
      todo.id === id ? updatedTodo : todo,
    );

    setTasks(updatedTasks);

    if (newTitle.trim() === '') {
      deleteTask(id);

      // setDeletingIds((prevIds: number[]) => [...prevIds, id]);
      // deleteTodo(id)
      //   .then(() => {
      //     setTasks(currentTodos => currentTodos.filter(todo => todo.id !== id));
      //     setDeletingIds(prevIds =>
      //       prevIds.filter(deletingId => deletingId !== id),
      //     );
      //     editRef.current = id;
      //   })
      //   .catch(() => {
      //     handleError(errorType.deleteTask);
      //     setCanEdit(true);
      //     setDeletingIds([]);
      //   });
    }

    updateTitleTodo(id, updatedTodo)
      .then(() => {
        setIsUpdating([]);
        setCanEdit(false);
      })
      .catch(() => {
        handleError(errorType.updateTodo);
        if (newTitle.trim() === '') {
          setCanEdit(true);
        }

        setCanEdit(true);
        editRef.current = id;
        const revertedTasks = tasks.map(todo =>
          todo.id === id ? { ...todo, title: todoToUpdate.title } : todo,
        );

        setTasks(revertedTasks);

        setIsUpdating([]);
      });
    setIsSubmitting(false);
  };

  const handleSubmitNewTitle = (id: number, title: string) => {
    const originalTodo = tasks.find(todo => todo.id === id);

    if (!originalTodo || originalTodo.title === newTitle.trim()) {
      return;
    }

    setIsSubmitting(true);
    setIsUpdating([id]);

    if (!title.trim()) {
      deleteTask(id);
      setIsSubmitting(false);

      return;
    }

    // Add a condition to prevent the function from running if it's already submitting
    if (!IsSubmitting) {
      updateNewTitle(id, title);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle((e.target as HTMLInputElement).value);
  };

  const sendTitle = (id: number) => {
    handleSubmitNewTitle(id, newTitle);
    setCanEdit(false);
  };

  const handleDoubleClick = (id: number, updateTitle: string) => {
    if (!canEdit) {
      setCanEdit(true);
      setNewTitle(updateTitle);
      editRef.current = id;
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number,
  ) => {
    if (e.key === 'Enter') {
      handleSubmitNewTitle(id, newTitle);
      setCanEdit(false);
    } else if (e.key === 'Escape') {
      setCanEdit(false);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {tempTodo && (
        <>
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title}
            </span>
            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay ', {
                'is-active': true,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        </>
      )}
      {filteredTodos.map(task => {
        const { title, completed, id } = task;

        return (
          <div
            key={id}
            data-cy="Todo"
            className={classNames('todo', { completed: completed })}
          >
            <label
              htmlFor={`Input-task-title#${id}`}
              className="todo__status-label"
            >
              <input
                id={`Input-task-title#${id}`}
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                onChange={() => handleCompleted(id)}
                checked={completed}
              />
            </label>
            {canEdit && editRef.current === id ? (
              <form
                key={id}
                onSubmit={e => {
                  e.preventDefault();
                  sendTitle(id);
                }}
                onBlur={e => {
                  e.preventDefault();
                  sendTitle(id);
                }}
              >
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={newTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleTitleChange(e)
                  }
                  autoFocus={true}
                  onKeyDown={e => handleKeyDown(e, id)}
                  // onKeyUp={e => e.keyCode == 27 && onEdit(null)}
                />
              </form>
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => handleDoubleClick(id, title)}
                >
                  {title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => deleteTask(id)}
                >
                  ×
                </button>
              </>
            )}

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay ', {
                'is-active': deletingIds.includes(id) || onUpdate.includes(id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>
  );
};
