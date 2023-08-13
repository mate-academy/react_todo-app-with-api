import {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useTodoContext } from '../context/todoContext/useTodoContext';
import { UpdateTodoArgs } from '../types/UpdateTodoArgs';
import { todosApi } from '../api/todos-api';
import { useErrorContext } from '../context/errorContext/useErrorContext';

interface TodoListItemProps {
  todo: Todo,
}

export const TodoListItem: FC<TodoListItemProps> = ({ todo }) => {
  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);
  const todoTitleRef = useRef<HTMLInputElement>(null);
  const {
    handlingTodoIds,
    setHandlingTodoIds,
    updateTodos,
    removeTodos,
  } = useTodoContext();

  const { notifyAboutError } = useErrorContext();

  useEffect(() => {
    todoTitleRef.current?.focus();
  }, [editedTodoId]);

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

  const onRemove = async (id: number) => {
    setHandlingTodoIds([id]);
    try {
      const result = await todosApi.remove([id]);

      if (result) {
        removeTodos([id]);
      }
    } catch (error) {
      if (error instanceof Error) {
        notifyAboutError(`Unable to delete a todo: ${error.message}`);
      }
    } finally {
      setHandlingTodoIds([]);
    }
  };

  const onChangeStatus = (id: number, isChecked: boolean) => {
    onEdit(id, { completed: isChecked });
  };

  return (
    <div
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

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onRemove(todo.id)}
      >
        ×
      </button>

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
  );
};
