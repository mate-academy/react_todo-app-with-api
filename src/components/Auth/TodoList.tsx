import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  filteredList: Todo[] | undefined;
  removeTodo: (todoId: number | undefined) => void;
  updateTODOCompleted: (todoId: number | undefined, completed: boolean) => void;
  updateTODOTitle: (todoId: number | undefined, title: string) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredList,
  removeTodo,
  updateTODOCompleted,
  updateTODOTitle,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTodoId, setCurrentTodoId] = useState(0);
  const [value, setValue] = useState('');

  const handle = (event: React.KeyboardEvent<HTMLSpanElement>, id: number) => {
    if (event.key === 'Enter') {
      setIsVisible(true);
      updateTODOTitle(id, value);
    }

    if (event.key === 'Ecs') {
      setIsVisible(true);
    }
  };

  return (
    <ul>
      {filteredList
        && filteredList.map((todo) => (
          <section className="todoapp__main" data-cy="TodoList">
            <li key={todo.id}>
              <div
                data-cy="Todo"
                className={classNames('todo', {
                  'todo completed': todo.completed,
                })}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    defaultChecked
                    onClick={() => {
                      updateTODOCompleted(todo.id, todo.completed);
                      setIsVisible(true);
                    }}
                  />
                </label>

                {isVisible && currentTodoId !== todo.id ? (
                  <>
                    <span
                      aria-hidden="true"
                      data-cy="TodoTitle"
                      className="todo__title"
                      onClick={() => setCurrentTodoId(todo.id)}
                      onDoubleClick={() => {
                        setIsVisible(false);
                      }}

                    >
                      {todo.title}
                    </span>
                    <button
                      type="button"
                      className="todo__remove"
                      data-cy="TodoDeleteButton"
                      onClick={() => removeTodo(todo.id)}
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <form>
                    <input
                      data-cy="TodoTitleField"
                      type="text"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                      value={value}
                      onChange={(event) => {
                        setValue(event.target.value);
                      }}
                      onKeyDown={(event) => handle(event, todo.id)}
                    />
                  </form>
                )}
                <div data-cy="TodoLoader" className="modal overlay">
                  <div
                    className="
                      modal-background
                      has-background-white-ter"
                  />
                  <div className="loader" />
                </div>
              </div>
            </li>
            {' '}
          </section>
        ))}
    </ul>
  );
};
