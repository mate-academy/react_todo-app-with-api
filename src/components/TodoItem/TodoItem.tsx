import classNames from 'classnames';
import React, {
  useEffect,
  useRef,
  useState,
  ChangeEvent,
} from 'react';

import { Todo } from '../../types/Todo';

import { TodoLoader } from '../TodoLoader/TodoLoader';

type Props = {
  todo: Todo;
  todos: Todo[]
  removeTodo: (TodoId: number) => void;
  selectedId: number[];
  isAdding: boolean;
  handleChange: (updateId: number, data: Partial<Todo>) => Promise<void>;
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

  const isLoading = selectedId.includes(todo.id) || (isAdding && todo.id === 0);

  const updateTodoTitle = () => {
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

  const todoTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleDoubleClick = () => {
    setDoubleClick(true);
    setSelectedTodo(todo.id);
    setNewTitle(todo.title);
  };

  const handleBlur = () => {
    updateTodoTitle();
    setDoubleClick(false);
  };

  const handleKeyPress = (event: { key: string }) => {
    if (event.key === 'Escape') {
      setDoubleClick(false);
    }

    if (event.key === 'Enter') {
      updateTodoTitle();
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [selectedTodo]);

  const { title, completed, id } = todo;

  return (
    <div
      data-cy="Todo"
      key={id}
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          ref={newTodoField}
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
        ) : (
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
