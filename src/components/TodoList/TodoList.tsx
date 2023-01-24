import cn from 'classnames';
import { useState } from 'react';

import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  onChangeTodo: (id: number, changedTitle: string) => void;
  onChangeComplete: (id: number, complete: boolean) => void,
  isClearComplete: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onChangeComplete,
  onChangeTodo,
  isClearComplete,
}) => {
  const [todoInProcessId, setTodoInProcessId] = useState([0]);
  const [changingId, setChangingId] = useState(Number);
  const [changedTitle, setChangeTitle] = useState(String);

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setChangingId(0);
    }
  };

  const handleChangeTodo = async (id: number, completed: boolean) => {
    setTodoInProcessId([...todoInProcessId, id]);
    await onChangeComplete(id, !completed);
    setTodoInProcessId(prevTodos => {
      return (prevTodos.map(item => (item !== id ? item : 0)));
    });
    setTodoInProcessId([]);
  };

  const handleSubmitTodo = async (
    event: React.FormEvent<HTMLFormElement>,
    title: string,
    id: number,
  ) => {
    event.preventDefault();
    setChangingId(0);
    if (title !== changedTitle) {
      setTodoInProcessId([...todoInProcessId, id]);
      await onChangeTodo(id, changedTitle);
      setTodoInProcessId(prevTodos => {
        return (prevTodos.map(item => (item !== id ? item : 0)));
      });
    }

    setChangeTitle('');
  };

  const handleDelete = async (id: number) => {
    setTodoInProcessId([...todoInProcessId, id]);
    await onDelete(id);
    setTodoInProcessId(prevTodos => {
      return (prevTodos.map(item => (item !== id ? item : 0)));
    });
  };

  return (
    <>
      {todos && (
        todos.map(todo => (
          <div
            data-cy="Todo"
            className={cn(
              'todo',
              { completed: todo.completed },
              { active: !todo.completed },
            )}
            key={todo.id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                onChange={() => {
                  handleChangeTodo(todo.id, todo.completed);
                }}
              />
            </label>

            {changingId === todo.id ? (
              <form
                onSubmit={(event) => {
                  handleSubmitTodo(event, todo.title, todo.id);
                }}
              >
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  defaultValue={todo.title}
                  onChange={(event) => {
                    setChangeTitle(event.target.value);
                  }}
                  onBlur={() => {
                    setChangingId(0);
                  }}
                  onKeyUp={handleKeyUp}
                />
              </form>
            ) : (
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => {
                  setChangingId(todo.id);
                  setChangeTitle(todo.title);
                }}
              >
                {todo.title}
              </span>
            )}
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                handleDelete(todo.id);
              }}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={cn(
                'modal overlay',
                {
                  'is-active': todoInProcessId.includes(todo.id)
                    || isClearComplete.includes(todo.id),
                },
              )}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )))}
    </>
  );
};
