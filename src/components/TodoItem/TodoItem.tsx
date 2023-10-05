import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { USER_ID, useTodosContext } from '../TodosContext';

interface Props {
  todo: Todo
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);

  const {
    setTodos,
    setErrorMessage,
    tempTodo,
    setLoading,
    isLoading,
    hangleDeleteTodo,
    updateInputCheckbox,
  } = useTodosContext();

  const titleInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (tempTodo && tempTodo.id === todo.id) {
      setLoading(tempTodo.id, true);
    }
  }, [tempTodo, todo.id]);

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

  const handleOnTodoSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const preparedTodoTitle = todoTitle.trim();

    try {
      if (!preparedTodoTitle) {
        setLoading(todo.id, true);

        await deleteTodo(todo.id);
        setTodos((prevTodos) => (
          prevTodos.filter(prevTodo => prevTodo.id !== todo.id)
        ));
      }

      if (todo.title !== preparedTodoTitle) {
        setLoading(todo.id, true);

        const getUpdateTodo = await updateTodo({
          id: todo.id,
          title: preparedTodoTitle,
          userId: USER_ID,
          completed: false,
        });

        setTodos((prevTodos) => prevTodos.map(currentTodo => (
          currentTodo.id !== getUpdateTodo.id
            ? currentTodo
            : getUpdateTodo
        )));
      }
    } catch {
      setErrorMessage('Unable to update a todo');
      titleInputRef.current?.focus();
    } finally {
      setLoading(todo.id, false);
    }

    setIsEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTodoTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => updateInputCheckbox(todo)}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={handleOnTodoSave}
            onBlur={handleOnTodoSave}
          >
            <input
              ref={titleInputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={todoTitle}
              onChange={(event) => {
                setTodoTitle(event.target.value);
              }}
              onKeyDown={handleKeyDown}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setIsEditing(true);
              }}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => hangleDeleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isLoading[todo.id],
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
