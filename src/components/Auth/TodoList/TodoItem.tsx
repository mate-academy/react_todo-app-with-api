import classNames from 'classnames';
import {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../../types/Todo';

type Props = {
  todo: Todo;
  todos: Todo[];
  removeTodo: (TodoId: number) => Promise<void>;
  selectedIds: number[];
  isAdding: boolean;
  handleOnChange: (updateId: number, data: Partial<Todo>) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  removeTodo,
  selectedIds,
  isAdding,
  handleOnChange,
}) => {
  const [doubleClicked, setDoubleClicked] = useState<boolean>(false);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [selectedTodo, setSelectedTodo] = useState(0);
  const newTodoField = useRef<HTMLInputElement>(null);

  const loaderCondition = selectedIds.includes(todo.id)
  || (isAdding && todo.id === 0);

  const { id, title, completed } = todo;

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [selectedTodo]);

  const UpdateTitle = () => {
    if (!newTodoTitle) {
      removeTodo(selectedTodo);
      setDoubleClicked(false);

      return;
    }

    if (newTodoTitle === todo.title) {
      setDoubleClicked(false);

      return;
    }

    if (todos.find(element => element.title === newTodoTitle)) {
      setDoubleClicked(false);
    }

    handleOnChange(selectedTodo, { title: newTodoTitle });
    setDoubleClicked(false);
    setNewTodoTitle('');
  };

  const TitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleDoubleClick = () => {
    setDoubleClicked(true);
    setSelectedTodo(todo.id);
    setNewTodoTitle(todo.title);
  };

  const handleBlur = () => {
    UpdateTitle();
    setDoubleClicked(false);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setDoubleClicked(false);
    }

    if (event.key === 'Enter') {
      UpdateTitle();
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
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleOnChange(id, { completed: !completed })}

        />
      </label>
      {doubleClicked && selectedTodo === todo.id
        ? (
          <form onSubmit={event => {
            event.preventDefault();
          }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={newTodoField}
              className="todo__title-field"
              value={newTodoTitle}
              placeholder="If your todo is empty, it will be deleted"
              onChange={TitleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyPress}
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
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                removeTodo(id);
              }}
            >
              ×
            </button>
          </>
        )}

      { loaderCondition && (
        <div
          data-cy="TodoLoader"
          className="modal overlay is-active"
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader is-loading " />
        </div>
      )}
    </div>
  );
};
