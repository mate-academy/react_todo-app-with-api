/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { toggleStatus } from '../../api/todos';

type Title = {
  title?: null | string,
};

type Props = {
  todos: Todo[],
  visibleTodos: Todo[],
  handleClick: (id: number, completed: boolean) => void,
  handleRemoveTodo: (id: number) => void,
  tempTodo: Title,
  newTodoField: any,
  loadTodosUser: any,
  isLoading: boolean,
  isLoadingItem: number,
};

export const TodoList: React.FC<Props> = ({
  // eslint-disable-next-line max-len
  todos,
  visibleTodos,
  handleClick,
  handleRemoveTodo,
  tempTodo,
  newTodoField,
  loadTodosUser,
  isLoading,
  isLoadingItem,
}) => {
  const [isEditting, setIsEditting] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  // const [change, setChange] = useState('');

  const sendChange = async () => {
    // console.log(newTodoField.current.value);
    await toggleStatus(currentId, { title: newTodoField.current.value });
    setIsEditting(false);
    setCurrentId(0);
    loadTodosUser();
  };

  // if (newTodoField.current?.focus()) {
  //   console.log('yep');
  // }

  const some = (event: any, id: number): any => {
    // setIsEditting(true);
    // setCurrentId(id);
    // eslint-disable-next-line no-restricted-globals
    if (event.detail === 2) {
      setIsEditting(true);
      setCurrentId(id);
    }
  };

  // const onChange = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   setChange(event.target.value);
  // };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.length > 0
        && (
          visibleTodos.map(todo => (
            <div
              data-cy="Todo"
              className={classNames('todo', {
                completed: todo.completed,
              })}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  onClick={() => handleClick(todo.id, todo.completed)}
                />
              </label>
              {isEditting && currentId === todo.id
                ? (
                  <form onSubmit={sendChange}>
                    <input
                      data-cy="TodoTitleField"
                      type="text"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                      defaultValue={todo.title}
                      // onChange={onChange}
                      ref={newTodoField}
                    />
                  </form>
                )
                : (
                  <>
                    {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                    <span
                      data-cy="TodoTitle"
                      className="todo__title"
                      // eslint-disable-next-line no-return-assign, no-restricted-globals
                      onClick={() => some(event, todo.id)}
                    >
                      {todo.title}
                    </span>

                    <button
                      type="button"
                      className="todo__remove"
                      data-cy="TodoDeleteButton"
                      onClick={() => handleRemoveTodo(todo.id)}
                    >
                      ×
                    </button>
                  </>
                )}

              <div
                data-cy="TodoLoader"
                className={
                  classNames('modal overlay', {
                    'is-active': isLoading && isLoadingItem === todo.id,
                  })
                }
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))
        )}
      {tempTodo.title !== null
        && (
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title || null}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}
    </section>
  );
};
