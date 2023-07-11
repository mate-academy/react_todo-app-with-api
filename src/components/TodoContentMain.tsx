/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  FC, useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { todosApi } from '../api/todos-api';
import { useTodoContext } from '../context/todoContext/useTodoContext';
import { useErrorContext } from '../context/errorContext/useErrorContext';
import { UpdateTodoArgs } from '../types/UpdateTodoArgs';

interface TodoContentMainProps {
  todos: Todo[],
  tempTodo: Todo | null,
}

export const TodoContentMain: FC<TodoContentMainProps> = (props) => {
  const { todos, tempTodo } = props;
  const {
    removeTodos,
    setHandlingTodoIds,
    handlingTodoIds,
    updateTodos,
  } = useTodoContext();
  const { notifyAboutError } = useErrorContext();
  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);
  const todoTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoTitleRef.current?.focus();
  }, [editedTodoId]);

  const onRemove = async (id: number) => {
    setHandlingTodoIds([id]);
    try {
      const result = await todosApi.remove([id]);

      if (result) {
        removeTodos([id]);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notifyAboutError(`Unable to delete a todo: ${error.message}`);
    } finally {
      setHandlingTodoIds([]);
    }
  };

  const onEdit = async (id: number, data: UpdateTodoArgs) => {
    try {
      setHandlingTodoIds([id]);
      const updatedTodos = await todosApi.update([{
        id,
        data,
      }]);

      updateTodos(updatedTodos);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notifyAboutError(`Unable to update a todo: ${error.message}`);
    } finally {
      setHandlingTodoIds([]);
    }
  };

  const onChangeStatus = (id: number, isChecked: boolean) => {
    onEdit(id, { completed: isChecked });
  };

  const handleTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (todoTitleRef.current) {
      todoTitleRef.current.value = event.target.value;
    }
  };

  const handleOnBlur = () => {
    setEditedTodoId(null);
  };

  const submit = async (
    event: React.FormEvent<HTMLFormElement>,
    id: number,
  ) => {
    event.preventDefault();
    const trimmedTitle = todoTitleRef.current?.value.trim();

    if (!trimmedTitle) {
      onRemove(id);

      return;
    }

    if (todoTitleRef.current) {
      await onEdit(id, { title: trimmedTitle });
      setEditedTodoId(null);
    }
  };

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <div
          key={todo.id}
          className={classNames(
            'todo',
            {
              completed: todo.completed,
            },
          )}
          onDoubleClick={() => setEditedTodoId(todo.id)}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={(event) => onChangeStatus(
                todo.id, event.target.checked,
              )}
            />
          </label>
          {editedTodoId === todo.id
            ? (
              <form onSubmit={(event) => submit(event, todo.id)}>
                <input
                  ref={todoTitleRef}
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  defaultValue={todo.title}
                  onBlur={handleOnBlur}
                  onChange={handleTodoChange}
                />
              </form>
            )
            : <span className="todo__title">{todo.title}</span>}

          {editedTodoId !== todo.id && (
            <button
              type="button"
              className="todo__remove"
              onClick={() => onRemove(todo.id)}
            >
              ×
            </button>
          )}

          <div
            className={classNames(
              'modal',
              'overlay',
              {
                'is-active': handlingTodoIds.includes(todo.id),
              },
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && (
        <article>
          <div
            className={classNames(
              'todo',
              {
                completed: tempTodo.completed,
              },
            )}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked={tempTodo.completed}
                onChange={(event) => onChangeStatus(
                  tempTodo.id, event.target.checked,
                )}
                disabled
              />
            </label>

            <span className="todo__title">{tempTodo.title}</span>

            <div
              className={classNames(
                'modal',
                'overlay',
                {
                  'is-active': true,
                },
              )}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        </article>
      )}
    </section>
  );
};
