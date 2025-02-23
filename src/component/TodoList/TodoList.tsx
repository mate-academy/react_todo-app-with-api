import { useContext, useRef } from 'react';
import { DispatchContext, StateContext } from '../../store/store';
import cn from 'classnames';
import { IsUseTodos } from '../../types/IsUseTodos';
import { USER_ID, changeTodoApi, deleteTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export const TodoList = () => {
  const dispatch = useContext(DispatchContext);
  const {
    todos,
    useTodos,
    changerId,
    idTodoSubmitting,
    vaitTodoId,
    changerTodo,
    tempTodo,
  } = useContext(StateContext);

  const inputRef = useRef<HTMLInputElement>(null);

  const todosFilter = todos.filter(todo => {
    switch (useTodos) {
      case IsUseTodos.Active:
        return !todo.completed;

      case IsUseTodos.Completed:
        return todo.completed;

      default:
        return true;
    }
  });

  const handleDeleteTodo = (id: number) => {
    dispatch({ type: 'setVaitTodoId', id: id });

    deleteTodo(id)
      .then(() => {
        dispatch({ type: 'removeTodo', id: id });
      })
      .catch(() => {
        dispatch({ type: 'setError', error: 'Unable to delete a todo' });
      })
      .finally(() => {
        dispatch({ type: 'deleteVaitTodoId', id: id });
      });
  };

  const hundleKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number,
  ) => {
    if (e.key === 'Escape') {
      dispatch({ type: 'escapeChangedText', id: id });
      dispatch({ type: 'setChangedTodoId', id: 0 });
    }
  };

  const handleCheckedTodo = (todo: Todo) => {
    dispatch({ type: 'setVaitTodoId', id: todo.id });

    changeTodoApi(todo.id, { ...todo, completed: !todo.completed })
      .then(() => {
        dispatch({ type: 'SetCheckedTodo', id: todo.id });
      })
      .catch(() => {
        dispatch({ type: 'setError', error: 'Unable to update a todo' });
      })
      .finally(() => {
        dispatch({ type: 'deleteVaitTodoId', id: todo.id });
      });
  };

  const handleSendTitleTodo = (todo: Todo) => {
    dispatch({ type: 'setVaitTodoId', id: todo.id });

    if (todo.title === changerTodo) {
      dispatch({ type: 'deleteVaitTodoId', id: todo.id });
      dispatch({ type: 'setChangedTodoId', id: 0 });

      return;
    }

    if (todo.title === '') {
      dispatch({ type: 'deleteVaitTodoId', id: todo.id });
      dispatch({ type: 'setChangedTodoId', id: 0 });
      handleDeleteTodo(todo.id);

      return;
    }

    changeTodoApi(todo.id, todo)
      .then(() => {
        dispatch({ type: 'setChangedTodoId', id: 0 });
      })
      .catch(() => {
        dispatch({ type: 'setError', error: 'Unable to update a todo' });
        inputRef.current?.focus();
      })
      .finally(() => {
        dispatch({ type: 'deleteVaitTodoId', id: todo.id });
      });
  };

  const hundleSubmitChangeTodo = (
    e: React.FormEvent<HTMLFormElement>,
    todo: Todo,
  ) => {
    e.preventDefault();

    handleSendTitleTodo(todo);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todosFilter.map(({ id, title, completed }) => (
          <CSSTransition key={id} timeout={300} classNames="temp-item">
            <div
              data-cy="Todo"
              className={cn('todo', { completed: completed })}
              key={id}
            >
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={completed}
                  onChange={() =>
                    handleCheckedTodo({ id, userId: USER_ID, title, completed })
                  }
                />
              </label>

              {id !== changerId && (
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() =>
                    changerId === 0 &&
                    dispatch({ type: 'setChangedTodoId', id: id })
                  }
                >
                  {title}
                </span>
              )}

              {id === changerId && (
                <form
                  onSubmit={e =>
                    hundleSubmitChangeTodo(e, {
                      id,
                      userId: USER_ID,
                      title,
                      completed,
                    })
                  }
                >
                  <input
                    ref={inputRef}
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={title}
                    onKeyUp={e => hundleKeyUp(e, id)}
                    autoFocus
                    onChange={e =>
                      dispatch({
                        type: 'changedTodoFromId',
                        id: id,
                        text: e.target.value,
                      })
                    }
                    onBlur={() =>
                      handleSendTitleTodo({
                        id,
                        userId: USER_ID,
                        title,
                        completed,
                      })
                    }
                  />
                </form>
              )}

              {/* Remove button appears only on hover */}
              {id !== changerId && (
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDeleteTodo(id)}
                >
                  ×
                </button>
              )}

              <div
                data-cy="TodoLoader"
                className={cn('modal overlay', {
                  'is-active':
                    idTodoSubmitting === id || vaitTodoId.includes(id),
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        ))}

        {!!tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <div data-cy="Todo" className="todo">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
