import classNames from 'classnames';
import {
  FormEvent, useState, useRef, useEffect,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  handleDelete: (
    todoId: number,
  ) => void,
  selectedTodos: number[],
  setSelectTodos: (userId: number[]) => void;
  handleUpdate: (todoId: number, data: Partial<Todo>) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDelete,
  selectedTodos,
  handleUpdate,
}) => {
  const [selectedTodo, setSelectedTodo] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');
  const selectedTodoField = useRef<HTMLInputElement>(null);

  const handleRemove = (event: FormEvent) => {
    event.preventDefault();
    handleDelete(todo.id);
  };

  const handleOnDoubleClick = (todoId:number, title:string) => {
    setSelectedTodo(todoId);
    setNewTitle(title);
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleSaveChages = (todoId: number, title: string) => {
    setSelectedTodo(null);
    if (!newTitle.trim()) {
      handleDelete(todoId);
    } else if (newTitle !== title) {
      handleUpdate(todoId, { title: newTitle });
    }
  };

  const handleCancelChanges = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setSelectedTodo(null);
    }
  };

  useEffect(() => {
    if (selectedTodoField.current) {
      selectedTodoField.current.focus();
    }
  }, [selectedTodo]);

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames(
          'todo', { completed: todo.completed },
        )}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            onClick={() => handleUpdate(
              todo.id, {
                completed: !todo.completed,
              },
            )}
            defaultChecked
          />
        </label>

        {selectedTodo === todo.id
          ? (
            <form
              onSubmit={event => {
                event.preventDefault();
                handleSaveChages(todo.id, todo.title);
              }}
            >
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                value={newTitle}
                onChange={event => handleChangeTitle(event)}
                onBlur={() => handleSaveChages(todo.id, todo.title)}
                placeholder="Empty todo will be deleted"
                onKeyDown={handleCancelChanges}
                ref={selectedTodoField}
              />
            </form>
          )

          : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => handleOnDoubleClick(todo.id, todo.title)}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={(event) => handleRemove(event)}
              >
                ×
              </button>
            </>
          ) }
        <div
          data-cy="TodoLoader"
          className={classNames(
            'modal overlay',
            { 'is-active': selectedTodos.includes(todo.id) || todo.id === 0 },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
