import classNames from 'classnames';
import {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader/TodoLoader';

type Props = {
  todo: Todo;
  todos: Todo[];
  removeTodo: (TodoId: number) => void;
  selectedId: number[];
  isAdding: boolean;
  handleChange: (todoId: number, property: Partial<Todo>) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  removeTodo,
  selectedId,
  isAdding,
  handleChange,
}) => {
  const [doubleClick, setDoubleClick] = useState(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [selectedTodo, setSelectedTodo] = useState(0);
  const newTodoField = useRef<HTMLInputElement>(null);

  const { title, id, completed } = todo;

  const isLoading = useMemo(() => selectedId.includes(id)
  || (isAdding && id === 0), [isAdding, selectedId, id]);

  const UpdateTodoTitle = () => {
    if (newTitle === todo.title) {
      setDoubleClick(false);

      return;
    }

    if (!newTitle) {
      removeTodo(selectedTodo);
      setDoubleClick(false);

      return;
    }

    if (todos.find(element => element.title === newTitle)) {
      setDoubleClick(false);
    }

    handleChange(selectedTodo, { title: newTitle });
    setDoubleClick(false);
    setNewTitle('');
  };

  const TodoTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleDoubleClick = () => {
    setDoubleClick(true);
    setSelectedTodo(todo.id);
    setNewTitle(todo.title);
  };

  const handleBlur = () => {
    UpdateTodoTitle();
    setDoubleClick(false);
  };

  const handleKeyPress = (event: { key: string; }) => {
    if (event.key === 'Escape') {
      setDoubleClick(false);
    }

    if (event.key === 'Enter') {
      UpdateTodoTitle();
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
          ref={newTodoField}
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
              onChange={TodoTitleChange}
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
        <TodoLoader
          todo={todo}
          selectedId={selectedId}
        />
      )}
    </div>
  );
};
