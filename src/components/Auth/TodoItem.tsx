import classNames from 'classnames';
import {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from './Loader';

type Props = {
  todo: Todo;
  todos: Todo[];
  removeTodo: (TodoId: number) => Promise<void>;
  selectedIds: number[],
  isAdding: boolean;
  handleOnChange: (updateId: number, data: Partial<Todo>) => Promise<void>;
  completedTodosId: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  removeTodo,
  isAdding,
  handleOnChange,
  completedTodosId,
  selectedIds,
}) => {
  const [doubleClick, setDoubleClick] = useState<boolean>(false);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [selectedTodo, setSelectedTodo] = useState(0);
  const [stateforNewTitle, setstateforNewTitle] = useState(false);
  const newTodoField = useRef<HTMLInputElement>(null);

  const { id, title, completed } = todo;

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [selectedTodo]);

  const UpdateTitle = () => {
    if (!newTodoTitle) {
      removeTodo(selectedTodo);
      setDoubleClick(false);

      return;
    }

    if (newTodoTitle === todo.title) {
      setDoubleClick(false);

      return;
    }

    if (todos.find(element => element.title === newTodoTitle)) {
      setDoubleClick(false);
      setSelectedTodo(0);
    }

    handleOnChange(selectedTodo, { title: newTodoTitle });
    setDoubleClick(false);
    setNewTodoTitle('');
    setSelectedTodo(0);
    setstateforNewTitle(true);
  };

  const TitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);

    setTimeout(() => {
      setstateforNewTitle(false);
    }, 1000);
  };

  const handleDoubleClick = () => {
    setDoubleClick(true);
    setSelectedTodo(todo.id);
    setNewTodoTitle(todo.title);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setDoubleClick(false);
      setSelectedTodo(0);
    }

    if (event.key === 'Enter') {
      UpdateTitle();
      setSelectedTodo(0);
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
      {doubleClick && selectedTodo === todo.id
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

      {(completedTodosId.includes(id)
          || selectedIds.includes(id)
            || (isAdding && !todo.id)
              || stateforNewTitle)
              && (
                <Loader />
              )}
    </div>
  );
};
