import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  visibleTodos: Todo[] | null,
  loading: boolean,
  onDeleteTodo: (id: number) => void,
  onTodoChange: (completed: boolean, title: string, id: number) => void,
  onChangeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void,
  changingTitle: string,
  setTodoTitle: (title: string) => void,
};

export const Main: React.FC<Props> = ({
  visibleTodos,
  loading,
  onDeleteTodo,
  onTodoChange,
  onChangeTitle,
  changingTitle,
  setTodoTitle,
}) => {
  const [changeCheck, setChangeCheck] = useState(false);
  const [changingFormId, setChangingFormId] = useState(0);

  return (
    <section className="todoapp__main">
      {visibleTodos?.map(todo => {
        const {
          completed,
          title,
          id,
        } = todo;
        const changeForm = () => {
          setChangingFormId(id);
          setChangeCheck(true);
          setTodoTitle(title);
        };

        const onSubmitChanges = (
          event: React.FormEvent<HTMLFormElement>,
        ) => {
          event.preventDefault();

          setChangingFormId(id);
          setChangeCheck(false);
          onTodoChange(
            !completed,
            changingTitle,
            id,
          );
          setTodoTitle('');
        };

        const deleting = () => {
          onDeleteTodo(id);
        };

        const changingComplete = () => {
          setChangingFormId(id);
          onTodoChange(completed, title, id);
        };

        return (
          <div className={classNames('todo', { completed })} key={id}>
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked
                onClick={changingComplete}
              />
            </label>

            {(changeCheck && changingFormId === id)
              ? (
                <>
                  <form onSubmit={onSubmitChanges}>
                    <input
                      type="text"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                      value={changingTitle}
                      onChange={onChangeTitle}
                    />
                  </form>
                </>
              )
              : (
                <>
                  <span
                    className="todo__title"
                    onDoubleClick={changeForm}
                  >
                    {title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    onClick={deleting}
                  >
                    ×
                  </button>

                  {(loading && changingFormId === id) && (
                    <div className="modal overlay is-active">
                      <div
                        className="modal-background has-background-white-ter"
                      />
                      <div className="loader" />
                    </div>
                  )}
                </>
              )}
          </div>
        );
      })}
    </section>
  );
};
