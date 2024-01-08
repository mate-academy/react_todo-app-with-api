import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo, updateTodo } from '../api/todos';
import { useTodoContext } from '../context';
import { Errors } from '../types/Errors';

type Props = {
  todo: Todo;
};

export const TodoInfo = ({ todo }: Props) => {
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const inputEditRef = useRef<HTMLInputElement>(null);

  const {
    allTodos,
    setAllTodos,
    errorHandler,
    tempTodo,
    isUpdating,
    setIsUpdating,
    inputRef,
  } = useTodoContext();

  const handleComplete = async (id: number, isCompleted: boolean) => {
    setIsUpdating((prevIds) => [...prevIds, id]);

    if (allTodos) {
      const updatedTodos = allTodos.map(td => {
        if (td.id === id) {
          return {
            ...todo,
            completed: isCompleted,
          };
        }

        return td;
      });

      try {
        await updateTodo(id, {
          completed: isCompleted,
        });

        setAllTodos(updatedTodos);
      } catch (error) {
        errorHandler(Errors.updateError);
      } finally {
        setIsUpdating((prevIds) => prevIds.filter((prevId) => prevId !== id));
      }
    }
  };

  const handleTodoDelete = (id: number) => {
    setIsUpdating((prevIds) => [...prevIds, id]);

    const deletingTodo = async () => {
      try {
        if (allTodos) {
          await deleteTodo(id);
          const updatedTodo = allTodos.filter(td => td.id !== id);

          setAllTodos(updatedTodo);
        }
      } catch (error) {
        errorHandler(Errors.deleteError);
      } finally {
        setIsUpdating((prevIds) => prevIds.filter((prevId) => prevId !== id));
        inputRef.current?.focus();
      }
    };

    deletingTodo();
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDoubleClick = (id: number) => {
    setEditTodoId(id);
  };

  const handleEditSubmit = async (event: React.FormEvent, id: number) => {
    event.preventDefault();
    setEditTodoId(id);

    if (title === todo.title) {
      setEditTodoId(null);

      return;
    }

    if (title.length === 0) {
      handleTodoDelete(id);

      setEditTodoId(null);

      return;
    }

    try {
      setIsLoading(true);

      if (allTodos) {
        const updatedTodos = allTodos.map(td => {
          if (td.id === id) {
            return {
              ...td,
              title: title.trim(),
            };
          }

          return td;
        });

        setAllTodos(updatedTodos);
      }

      await updateTodo(id, {
        title,
      });
      setEditTodoId(null);
    } catch (error) {
      inputEditRef.current?.focus();
      errorHandler(Errors.updateError);
    } finally {
      setIsLoading(false);
      inputRef.current?.blur();
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && editTodoId !== null) {
      setEditTodoId(null);
    }
  };

  useEffect(() => {
    inputEditRef.current?.focus();
  }, [editTodoId, inputEditRef]);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { 'todo completed': todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => handleComplete(todo.id, !todo.completed)}
        />
      </label>

      {editTodoId && editTodoId === todo.id
        ? (
          <form onSubmit={(event) => handleEditSubmit(event, todo.id)}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={inputEditRef}
              value={title}
              onChange={handleTitleChange}
              onBlur={(event) => handleEditSubmit(event, todo.id)}
              onKeyUp={handleKeyUp}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                handleDoubleClick(todo.id);
                setTitle(todo.title);
              }}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleTodoDelete(todo.id)}
            >
              ×
            </button>

          </>
        )}
      {isLoading
        && (
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        ) }
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isUpdating.includes(todo.id) || todo.id === tempTodo?.id,
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
