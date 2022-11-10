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
  const [doubleClicked, setDoubleClicked] = useState<boolean>(false);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [selectedTodo, setSelectedTodo] = useState(0);
  const newTodoField = useRef<HTMLInputElement>(null);

  const { id, title, completed } = todo;

  const loaderCondition = completedTodosId.includes(id)
  || selectedIds.includes(id)
  || (isAdding && todo.id === 0);

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
      setSelectedTodo(0);
    }

    handleOnChange(selectedTodo, { title: newTodoTitle });
    setDoubleClicked(false);
    setNewTodoTitle('');
    setSelectedTodo(0);
  };

  const TitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleDoubleClick = () => {
    setDoubleClicked(true);
    setSelectedTodo(todo.id);
    setNewTodoTitle(todo.title);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setDoubleClicked(false);
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

      {loaderCondition && (
        <Loader />
      )}
    </div>
  );
};
