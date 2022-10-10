import classNames from 'classnames';
import { ChangeEvent, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo,
  isLoaded: boolean,
  removeTodo: (param: number) => void;
  handleChange: (todoId: number, data: Partial<Todo>) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoaded,
  removeTodo,
  handleChange,
}) => {
  const [doubleClick, setDoubleClick] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const updateTodoTitle = (todoId: number) => {
    if (newTitle === todo.title) {
      setDoubleClick(false);

      return;
    }

    if (!newTitle) {
      removeTodo(todoId);
      setDoubleClick(false);

      return;
    }

    handleChange(todoId, { title: newTitle });
    setDoubleClick(false);
    setNewTitle('');
  };

  const newTodoTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleDoubleClick = () => {
    setDoubleClick(true);
    setNewTitle(todo.title);
  };

  const handlePressedKey = (event: any) => {
    if (event.key === 'Enter') {
      updateTodoTitle(todo.id);
      setDoubleClick(false);
    }

    if (event.key === 'Escape') {
      setDoubleClick(false);
    }
  };

  const handleBlur = () => {
    updateTodoTitle(todo.id);
    setDoubleClick(false);
  };

  const { completed, id, title } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleChange(id, { completed: !completed })}
        />
      </label>

      {doubleClick
        ? (
          <form onSubmit={event => event.preventDefault()}>
            <input
              data-cy="NewTodoField"
              type="text"
              value={newTitle}
              ref={input => input && input.focus()}
              className="todoapp__new-todo"
              placeholder="Empty todo will be deleted"
              onChange={newTodoTitle}
              onKeyDown={handlePressedKey}
              onBlur={handleBlur}
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
              onClick={() => removeTodo(id)}
            >
              ×
            </button>
            {
              isLoaded
            && <Loader />
            }
          </>
        )}
    </div>
  );
};
