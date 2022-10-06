import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
} from 'react';
import classNames from 'classnames';
import { Loader } from '../Loader/Loader';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  removeTodo:(todoId: number) => void;
  updateState:(todoId: number, property: Partial<Todo>) => void;
  selectedTodoId: number;
  isToggle: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  updateState,
  selectedTodoId,
  isToggle,
}) => {
  const { id, title, completed } = todo;
  const [doubleClick, setDoubleClick] = useState(false);
  const [todoTitle, setTodoTitle] = useState(title);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [doubleClick]);

  const deleteTodo = () => removeTodo(todo.id);

  const changeStatus = () => updateState(id, { completed: !completed });

  const changeTitle = () => {
    if (todoTitle.trim().length === 0) {
      removeTodo(todo.id);
      setDoubleClick(false);

      return;
    }

    if (todoTitle === todo.title) {
      setDoubleClick(false);
    }

    updateState(todo.id, { title: todoTitle });
    setDoubleClick(false);
    setTodoTitle('');
  };

  const handleTitleUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleBlur = () => {
    changeTitle();
    setDoubleClick(false);
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setDoubleClick(false);
    }

    if (event.key === 'Enter') {
      changeTitle();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={changeStatus}
        />
      </label>

      { doubleClick
        ? (
          <form onSubmit={changeTitle}>
            <input
              type="text"
              data-cy="TodoTitleField"
              value={todoTitle}
              ref={newTodoField}
              placeholder="Empty todo will be deleted"
              className="todo__title-field"
              onBlur={handleBlur}
              onChange={handleTitleUpdate}
              onKeyDown={onKeyPress}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setDoubleClick(true);
                setTodoTitle(title);
              }}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={deleteTodo}
            >
              ×
            </button>
            {((selectedTodoId === todo.id) || isToggle) && (
              <Loader
                isToggle={isToggle}
              />
            )}
          </>
        )}

    </div>
  );
};
