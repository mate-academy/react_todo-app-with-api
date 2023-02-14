import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classnames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';
import { useOnFilteredStatusHandler } from '../../hooks/hooks';
import { Errors } from '../../types/Errors';
import { TodosContext, TodosContextType } from '../Context/TodosContext';

interface TodoItemProps {
  todo: Todo;
  removeTodoHandler: (todoId: number) => Promise<void>;
  renameTodoHandler: (todo: Todo, newTitle: string) => Promise<void>;
  onLoading: boolean;
  setErrorMessage: React.Dispatch<React.SetStateAction<Errors>>;
  setSelectedTodosId: React.Dispatch<React.SetStateAction<number[]>>;
}
export const TodoItem: FunctionComponent<TodoItemProps> = ({
  todo,
  removeTodoHandler,
  renameTodoHandler,
  onLoading,
  setErrorMessage,
  setSelectedTodosId,
}) => {
  const {
    title,
    completed,
    id,
  } = todo;
  const { setTodos } = useContext(TodosContext) as TodosContextType;

  const [newTodoTitle, setNewTodoTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const newTodoTitleRef = useRef<HTMLInputElement>(null);
  const onFilterStatusHandler = useOnFilteredStatusHandler(
    setTodos, setErrorMessage, setSelectedTodosId,
  );

  useEffect(() => {
    if (newTodoTitleRef.current) {
      newTodoTitleRef.current.focus();
    }
  });

  const successEditHandler = useCallback(() => {
    renameTodoHandler(todo, newTodoTitle);
    setIsEditing(false);
  }, [newTodoTitle]);

  const keyEscapeHandler = useCallback((
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setNewTodoTitle(title);
    }
  }, []);

  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewTodoTitle(e.target.value);
    }, [],
  );

  return (
    <div
      data-cy="Todo"
      className={classnames('todo', {
        'todo completed': completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onFilterStatusHandler(todo)}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            successEditHandler();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={newTodoTitleRef}
            value={newTodoTitle}
            onChange={onChangeHandler}
            onBlur={successEditHandler}
            onKeyDown={keyEscapeHandler}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => removeTodoHandler(id)}
          >
            ×
          </button>
        </>
      )}

      <Loader isLoading={onLoading} />
    </div>
  );
};
