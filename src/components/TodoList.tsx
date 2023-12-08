import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { removeTodo, updateTodo } from '../api/todos';

export type TodoListProps = {
  todos: Todo[]
  setErrorText: (error: string) => void
  removeOnResponse:(id:number) => void
  listToOperation: number[]
  setDelited: React.Dispatch<React.SetStateAction<number>>;
  updateOnResponse: (todo: Todo) => void
};

export const TodoList = ({
  todos, setErrorText, removeOnResponse, listToOperation, setDelited,
  updateOnResponse,
}: TodoListProps) => {
  const [actionId, setActionId] = useState<number>(-1);
  const [titleToUpdateId, setTitleToUpdateId] = useState<number>(-1);
  const titleRef = useRef<HTMLInputElement>(null);

  const remove = (id: number) => {
    setActionId(id);
    removeTodo(id)
      .then(() => removeOnResponse(id))
      .catch(() => {
        setErrorText('Unable to delete a todo');
      })
      .finally(() => {
        setActionId(-1);
        setDelited((prev) => prev + 1);
      });
  };

  const update = (id: number) => {
    const tmp = todos.find((todo) => todo.id === id);

    if (tmp) {
      const item = { ...tmp, completed: !tmp.completed };

      setActionId(item.id);
      updateTodo(item)
        .then((response) => updateOnResponse(response))
        .catch(() => {
          setErrorText('Unable to update a todo');
        })
        .finally(() => {
          setActionId(-1);
        });
    }
  };

  const updateTitle = (event: React.FormEvent, id: number) => {
    event.preventDefault();

    const tmp = todos.find((todo) => todo.id === id);

    if (tmp) {
      if (titleRef.current?.value.trim()) {
        if (tmp.title !== titleRef.current?.value.trim()) {
          const item = { ...tmp, title: titleRef.current?.value.trim() };

          setActionId(item.id);
          updateTodo(item)
            .then((response) => {
              updateOnResponse(response);
              setTitleToUpdateId(-1);
            })
            .catch(() => {
              setErrorText('Unable to update a todo');
              titleRef.current?.focus();
            })
            .finally(() => {
              setActionId(-1);
            });
        } else {
          setTitleToUpdateId(-1);
        }
      } else {
        remove(id);
      }
    }
  };

  const onKey = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setTitleToUpdateId(-1);
    }
  };

  useEffect(() => {
    if (titleRef.current) {
      const item = todos.find((todo) => todo.id === titleToUpdateId);

      if (item) {
        titleRef.current.value = item.title;
      }

      titleRef.current.focus();
    }
  }, [titleToUpdateId, todos]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((({ id, completed, title }) => (
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
              onChange={() => update(id)}
            />
          </label>
          {id === titleToUpdateId
            ? (
              <form onSubmit={(event) => updateTitle(event, id)}>
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  ref={titleRef}
                  onBlur={(event) => updateTitle(event, id)}
                  onKeyUp={(event) => onKey(event)}
                />
              </form>
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => setTitleToUpdateId(id)}
                >
                  {title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => remove(id)}
                >
                  ×
                </button>
              </>
            ) }
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay',
              {
                'is-active': id === actionId || listToOperation.includes(id),
              })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )))}
    </section>
  );
};
