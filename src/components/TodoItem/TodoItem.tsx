import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  useMemo,
  useCallback,
} from 'react';
import classNames from 'classnames';
import { Loader } from '../Loader/Loader';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  removeTodo:(todoId: number) => void;
  changeProperty:(todoId: number, property: Partial<Todo>) => void;
  selectedTodoId: number | null;
  isToggling: boolean;
  isAdding: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  changeProperty,
  selectedTodoId,
  isToggling,
  isAdding,
}) => {
  const { id, title, completed } = todo;
  const [doubleClick, setDoubleClick] = useState(false);
  const [todoTitleField, setTodoTitleField] = useState(title);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [doubleClick]);

  const deleteTodo = useCallback(() => removeTodo(todo.id), [todo.id]);

  const changeStatus = useCallback(() => changeProperty(id,
    { completed: !completed }), [id]);

  const changeTitle = useCallback(() => {
    if (todoTitleField.trim().length === 0) {
      removeTodo(todo.id);
      setDoubleClick(false);

      return;
    }

    if (todoTitleField === todo.title) {
      setDoubleClick(false);
    }

    changeProperty(todo.id, { title: todoTitleField });
    setDoubleClick(false);
    setTodoTitleField('');
  }, [todo.id, doubleClick, todoTitleField]);

  const handleTitleUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    setTodoTitleField(event.target.value);
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

  const loaderStatus = useMemo(() => (selectedTodoId === todo.id)
  || (isAdding && todo.id === 0)
  || isToggling, [todo.id, selectedTodoId, isAdding, isToggling]);

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
              value={todoTitleField}
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
                setTodoTitleField(title);
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
            { loaderStatus && (
              <Loader />
            )}
          </>
        )}
    </div>
  );
};
