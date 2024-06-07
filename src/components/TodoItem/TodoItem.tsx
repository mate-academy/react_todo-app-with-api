import React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';
import { deleteTodos, updateTodo } from '../../api/todos';
import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';
import { DispatchContext, StateContext } from '../../utils/GlobalStateProvider';
import { Loader } from '../Loader';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  handleError: (el: Errors) => void;
};

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

/* eslint-disable react/display-name */
export const TodoItem: React.FC<Props> = React.memo(({ todo, handleError }) => {
  const dispatch = useContext(DispatchContext);
  const { todos, processingList, isDoubleClicked } = useContext(StateContext);

  const inputActive = useRef<HTMLInputElement>(null);
  const [editedTitle, setEditedTitle] = useState('');

  const { title, completed, id } = todo;

  const handleDelete = () => {
    handleError(Errors.reset);

    dispatch({ type: 'setProcessingList', payload: [todo.id] });
    let isError = false;

    deleteTodos(todo.id)
      .catch(error => {
        if (error) {
          isError = true;
        }

        handleError(Errors.deletingError);
      })
      .then(() => {
        if (!isError) {
          dispatch({
            type: 'setTodos',
            payload: todos.filter(prevTodo => todo.id !== prevTodo.id),
          });
        }
      })
      .finally(() => {
        dispatch({ type: 'setProcessingList', payload: [] });
      });
  };

  const handleChangeStatus = () => {
    const newUpdatingList = [...processingList, id];

    dispatch({ type: 'setProcessingList', payload: newUpdatingList });

    updateTodo(id, { ...todo, completed: !completed })
      .then(() => {
        dispatch({
          type: 'setTodos',
          payload: [
            ...todos.map(currentTodo => {
              if (newUpdatingList.includes(currentTodo.id)) {
                return {
                  ...currentTodo,
                  completed: !currentTodo.completed,
                };
              }

              return currentTodo;
            }),
          ],
        });
        dispatch({
          type: 'setProcessingList',
          payload: newUpdatingList.filter(currentId => currentId !== id),
        });
      })
      .catch(e => {
        handleError(Errors.updateError);
        throw e;
      })
      .finally(() => {
        dispatch({
          type: 'setProcessingList',
          payload: [],
        });
      });
  };

  const handleTodoDestroy = (handleTodo: Todo) => {
    const newTodos = todos.filter(elem => elem.id !== handleTodo.id);

    dispatch({
      type: 'setTodos',
      payload: newTodos,
    });
  };

  const updateTitle = () => {
    const trimmedTitle = editedTitle.trim();
    let isError = false;

    dispatch({ type: 'setProcessingList', payload: [todo.id] });

    if (title === trimmedTitle) {
      dispatch({ type: 'setProcessingList', payload: [] });
      inputActive.current?.blur();

      return;
    }

    if (!trimmedTitle) {
      deleteTodos(todo.id)
        .then(() => {
          handleTodoDestroy(todo);
        })
        .catch(() => {
          handleError(Errors.deletingError);
        })
        .finally(() => {
          dispatch({ type: 'setProcessingList', payload: [] });
        });

      return;
    }

    updateTodo(id, { ...todo, title: editedTitle.trim() })
      .then(() => {
        const newTodos = todos.map(currentTodo =>
          currentTodo.id === id
            ? { ...currentTodo, title: editedTitle.trim() }
            : currentTodo,
        );

        dispatch({ type: 'setTodos', payload: newTodos });
      })
      .catch(() => {
        handleError(Errors.updateError);
        isError = true;
      })
      .finally(() => {
        inputActive.current?.blur();

        if (isError) {
          inputActive.current?.focus();
          setEditedTitle(editedTitle.trim());
        }

        dispatch({ type: 'setProcessingList', payload: [] });
      });
  };

  const handleBlur = (
    e: React.ChangeEvent<HTMLInputElement>,
    handleTodo: Todo,
  ) => {
    const changedTitleOnBlur = todos.map(elem => {
      if (elem.id === handleTodo.id && e.target.value.length > 0) {
        return {
          ...elem,
          title: e.target.value.trim(),
        };
      }

      return elem;
    });

    if (processingList.length === 0) {
      updateTitle();

      dispatch({
        type: 'setIsDoubleClicked',
        payload: { state: false, id: null },
      });
      dispatch({ type: 'setTodos', payload: changedTitleOnBlur });
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    updateTitle();
  };

  useEffect(() => {
    if (inputActive.current && todo) {
      inputActive.current.focus();
    }
  }, [isDoubleClicked.id, todos, todo]);

  const doubleClick = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      dispatch({
        type: 'setIsDoubleClicked',
        payload: { state: false, id: null },
      });
    }
  };

  const onDoubleClick = () => {
    dispatch({
      type: 'setIsDoubleClicked',
      payload: { state: true, id },
    });
    setEditedTitle(title);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleChangeStatus}
        />
      </label>

      {isDoubleClicked.id === todo.id ? (
        <form onSubmit={submit}>
          <input
            ref={inputActive}
            data-cy="TodoTitleField"
            defaultValue={title}
            type="text"
            onBlur={e => handleBlur(e, todo)}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onKeyUp={doubleClick}
            onChange={e => setEditedTitle(e.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={onDoubleClick}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      <Loader processingList={processingList} todoId={todo.id} />
    </div>
  );
});
