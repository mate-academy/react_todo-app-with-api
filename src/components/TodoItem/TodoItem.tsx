import classNames from 'classnames';
import {
  useEffect,
  useState,
  useRef,
  ChangeEvent,
  KeyboardEvent,
} from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todos: Todo[],
  todo: Todo;
  onRemove: (param: number) => void,
  selectedId: number[],
  isAdding: boolean,
  handleOnChange: (updateId: number, data: Partial<Todo>) => Promise<void>,
  completedTodosId: number[],
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  onRemove,
  selectedId,
  isAdding,
  handleOnChange,
  completedTodosId,
}) => {
  const [doubleClicked, setDoubleClicked] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [selectedTodo, setSelectedTodo] = useState(0);

  const newTodoField = useRef<HTMLInputElement>(null);

  const { id, completed } = todo;

  const loaderOn = selectedId.includes(id)
    || completedTodosId.includes(id)
    || (isAdding && todo.id === 0);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [selectedTodo]);

  const UpdateTitle = () => {
    if (!newTodoTitle) {
      onRemove(selectedTodo);
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

  const titleChange = (event: ChangeEvent<HTMLInputElement>) => {
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
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
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
          <form onSubmit={UpdateTitle}>
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={newTodoField}
              className="todo__title-field"
              value={newTodoTitle}
              placeholder="Empty todo will be deleted"
              onChange={titleChange}
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
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onRemove(todo.id)}
            >
              ×
            </button>
          </>
        )}

      {loaderOn && (
        <Loader />
      )}
    </div>
  );
};
