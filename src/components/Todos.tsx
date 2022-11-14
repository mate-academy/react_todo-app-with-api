import classnames from 'classnames';
import React, {
  useState, RefObject, useEffect, useRef,
} from 'react';
import { Loader } from './Loader';
import { Todo } from '../types/Todo';

type Props = {
  isAdding: boolean,
  todo: Todo,
  deleteTodo:(param: number) => void,
  loadingTodoIds: number[],
  changeTodo: (updateId: number, data: Partial<Todo>) => Promise<void>,
  newTodoField: RefObject<HTMLInputElement>,
};

export const Todos: React.FC<Props> = ({
  isAdding,
  todo,
  deleteTodo,
  loadingTodoIds,
  changeTodo,
  newTodoField,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const [selectedTodo, setSelectedTodo] = useState<number | null>(null);
  const selectedTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [selectedTodo]);

  const handleOnDoubleClick = (todoId:number, title:string) => {
    setSelectedTodo(todoId);
    setNewTitle(title);
  };

  const handleSaveChanges = (
    todoId: number,
    title: string,
  ) => {
    setSelectedTodo(null);

    if (newTitle.trim().length === 0) {
      deleteTodo(todoId);
    } else if (newTitle !== title) {
      changeTodo(todoId, { title: newTitle });
    }
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleCancelChanges = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setSelectedTodo(null);
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classnames(
        'todo',
        {
          completed: todo.completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={
            () => changeTodo(todo.id, {
              completed: !todo.completed,
            })
          }
        />
      </label>

      {selectedTodo === todo.id
        ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSaveChanges(todo.id, todo.title);
            }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              value={newTitle}
              onChange={(event) => handleChangeTitle(event)}
              onBlur={() => handleSaveChanges(todo.id, todo.title)}
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
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

      {((isAdding && todo.id === 0) || loadingTodoIds.includes(todo.id)) && (
        <Loader />
      )}

    </div>
  );
};
