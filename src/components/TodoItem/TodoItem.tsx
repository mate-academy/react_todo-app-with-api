import classNames from 'classnames';
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader/TodoLoader';
import { PressedButton } from '../../types/PressedButton';

type Props = {
  todo: Todo;
  todos: Todo[];
  removeTodo: (TodoId: number) => void;
  selectedId: number[];
  isAdding: boolean;
  handleChange: (updateId: number, data: Partial<Todo>) => Promise<void>;
  selectedTodo: number;
  setSelectedTodo: (value: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  removeTodo,
  selectedId,
  isAdding,
  handleChange,
  selectedTodo,
  setSelectedTodo,
}) => {
  const [doubleClick, setDoubleClick] = useState(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const newTodoField = useRef<HTMLInputElement>(null);

  const { title, id, completed } = todo;

  const isLoading = useMemo(() => selectedId.includes(id)
  || (isAdding && id === 0), [isAdding, selectedId, id]);

  const updateTodoTitle = useCallback(() => {
    if (!newTitle) {
      removeTodo(selectedTodo);
      setDoubleClick(false);

      return;
    }

    if (newTitle === todo.title) {
      setDoubleClick(false);

      return;
    }

    if (todos.find(element => element.title === newTitle)) {
      setDoubleClick(false);
      setSelectedTodo(0);
    }

    handleChange(selectedTodo, { title: newTitle });
    setDoubleClick(false);
    setNewTitle('');
    setSelectedTodo(0);
  }, [newTitle, selectedTodo, doubleClick]);

  const todoTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleDoubleClick = useCallback(() => {
    setDoubleClick(true);
    setSelectedTodo(id);
    setNewTitle(todo.title);
  }, [doubleClick]);

  const handleBlur = () => {
    updateTodoTitle();
    setDoubleClick(false);
  };

  const handleKeyPress = (event: { key: string; }) => {
    if (event.key === PressedButton.Escape) {
      setDoubleClick(false);
    }

    if (event.key === PressedButton.Enter) {
      updateTodoTitle();
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [selectedTodo]);

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
      data-cy="Todo"
      key={id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          data-cy="TodoStatus"
          checked={completed}
          onChange={() => handleChange(id, { completed: !completed })}
        />
      </label>
      {doubleClick && selectedTodo === id
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
              value={newTitle}
              placeholder="Employ todo will be deleted"
              onChange={todoTitleChange}
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
      {isLoading && (
        <TodoLoader />
      )}
    </div>
  );
};
