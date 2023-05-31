import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import cn from 'classnames';
import { TodoContext } from '../../TodoContext/TodoContext';
import { Todo } from '../../types/Todo';
import { Errors } from '../../utils/enums';
import { client } from '../../utils/fetchClient';

interface Props {
  todo: Todo;
}

export const TodoItem: FC<Props> = ({ todo }) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const {
    todos,
    setTodos,
    editingTodoId,
    setEditingTodoId,
    editTodoTitle,
    setEditTodoTitle,
    deletingTodoId,
    setDeletingTodoId,
    clearingTodosId,
    setClearingTodosId,
    errorMessage,
    setErrorMessage,
  } = useContext(TodoContext);
  const focusedEditInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTodoId) {
      focusedEditInput.current?.focus();
    }
  }, [editingTodoId]);

  const delayErrorDisappear = useCallback(() => {
    setTimeout(() => {
      setErrorMessage(Errors.NoErrors);
    }, 3000);
  }, [errorMessage]);

  const handleInputTitleChange = useCallback(
    (value: string) => {
      setEditTodoTitle(value);
    }, [editTodoTitle],
  );

  const handleStartEditing = useCallback((todoId: number) => {
    setEditingTodoId(todoId);
  }, []);

  const handleTodoDelete = useCallback(async (todoId: number) => {
    setDeletingTodoId(todoId);
    try {
      await client.delete(`/todos/${todoId}`);
      setTodos(prevTodos => prevTodos
        .filter(({ id: deleteId }) => deleteId !== todoId));
    } catch {
      setErrorMessage(Errors.DeleteError);
      delayErrorDisappear();
    } finally {
      setDeletingTodoId(null);
    }
  }, []);

  const handleTodoEdit = useCallback(
    async (
      event: React.FormEvent<HTMLFormElement>,
      currentTodoTitle: string,
    ) => {
      event.preventDefault();
      const currentTodoId = editingTodoId;

      setEditingTodoId(null);
      try {
        if (currentTodoTitle === editTodoTitle) {
          return;
        }

        if (!editTodoTitle && currentTodoId) {
          try {
            await handleTodoDelete(currentTodoId);
          } catch {
            setErrorMessage(Errors.DeleteError);
          }

          return;
        }

        if (currentTodoId) {
          setClearingTodosId(prevIds => [...prevIds, currentTodoId]);
          await client.patch(`/todos/${currentTodoId}`, { title: editTodoTitle });

          setTodos(todos.map(todoToUpdate => {
            if (todoToUpdate.id === currentTodoId) {
              return {
                ...todoToUpdate,
                title: editTodoTitle,
              };
            }

            return todoToUpdate;
          }));
        }
      } catch {
        setErrorMessage(Errors.UpdateError);
      } finally {
        setEditTodoTitle('');
        setClearingTodosId([]);
      }
    }, [editingTodoId, editTodoTitle],
  );

  const handleCompleteTodo = useCallback(
    async (todoId: number, isCompleted: boolean) => {
      try {
        setClearingTodosId(prevIds => [...prevIds, todoId]);
        await client.patch(`/todos/${todoId}`, { completed: !isCompleted });

        setTodos(prevTodos => prevTodos.map(todoToComplete => {
          if (todoToComplete.id === todoId) {
            return {
              ...todo,
              completed: !todoToComplete.completed,
            };
          }

          return todoToComplete;
        }));
      } catch {
        setErrorMessage(Errors.UpdateError);
      } finally {
        setClearingTodosId(prevIds => prevIds
          .filter(item => item !== todoId));
      }
    }, [],
  );

  return (
    <div
      className={cn(
        'todo',
        { completed },
      )}
      key={id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleCompleteTodo(id, completed)}
        />
      </label>

      {editingTodoId === id
        ? (
          <form
            onSubmit={(event) => handleTodoEdit(event, title)}
            onBlur={(event) => handleTodoEdit(event, title)}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editTodoTitle}
              onChange={(event) => handleInputTitleChange(
                event.target.value,
              )}
              ref={focusedEditInput}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => {
                handleStartEditing(id);
                setEditTodoTitle(title);
              }}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => handleTodoDelete(id)}
            >
              ×
            </button>
          </>
        )}

      <div className={cn('modal overlay', {
        'is-active': (
          deletingTodoId === id
          || clearingTodosId.some(item => item === id)
        ),
      })}
      >
        <div
          className="modal-background
        has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
