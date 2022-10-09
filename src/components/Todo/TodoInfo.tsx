import classNames from 'classnames';
import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';

interface Props {
  todo: Todo;
  deleteTodo: (value: number) => void;
  isAdding: boolean;
  selectedIds: number[];
  changeTodo: (value: number, data: Partial<Todo>) => Promise<void>;
}

export const TodoInfo: React.FC<Props> = ({
  todo,
  deleteTodo,
  isAdding,
  selectedIds,
  changeTodo,
}) => {
  const [doubleClicked, setDoubleClicked] = useState<boolean>(false);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [selectedTodo, setSelectedTodo] = useState<number>(0);

  const selectedTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedTodoField.current) {
      selectedTodoField.current.focus();
    }
  }, [selectedTodo]);

  const changeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleDoubleClick = () => {
    setDoubleClicked(true);
    setNewTodoTitle(todo.title);
    setSelectedTodo(todo.id);
  };

  const saveChages = (todoId: number, title: string) => {
    setSelectedTodo(0);
    if (!newTodoTitle.trim()) {
      deleteTodo(todoId);
    } else if (newTodoTitle !== title) {
      changeTodo(todoId, { title: newTodoTitle });
    }
  };

  const cancelChanges = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setSelectedTodo(0);
      setDoubleClicked(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
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
          onClick={() => {
            changeTodo(todo.id, { completed: !todo.completed });
          }}
        />
      </label>

      {doubleClicked && selectedTodo === todo.id
        ? (
          <form onSubmit={event => {
            event.preventDefault();
            saveChages(todo.id, todo.title);
          }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={selectedTodoField}
              className="todo__title-field"
              value={newTodoTitle}
              placeholder="If your todo is empty, it will be deleted"
              onChange={changeTitle}
              onBlur={() => saveChages(todo.id, todo.title)}
              onKeyDown={cancelChanges}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                deleteTodo(todo.id);
              }}
            >
              ×
            </button>
          </>
        )}

      {(selectedIds.includes(todo.id) || (isAdding && todo.id === 0)) && (
        <Loader />
      )}
    </div>
  );
};
