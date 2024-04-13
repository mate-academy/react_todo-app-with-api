import React, { useContext, useEffect, useRef, useState } from 'react';
import { USER_ID, postTodos, updateTodo } from '../../api/todos';
import { Actions, DispatchContext, StateContext } from '../../Store';
import { Todo } from '../../types/Todo';
import { wait } from '../../utils/fetchClient';
import classNames from 'classnames';

export const Header: React.FC = () => {
  const [title, setTitle] = useState('');
  const dispatch = useContext(DispatchContext);
  const { isAdding, todos } = useContext(StateContext);
  const textField = useRef<HTMLInputElement | null>(null);
  const isIncompleted = todos.some(todo => !todo.completed);
  const allCompleted = todos.every(todo => todo.completed);

  useEffect(() => {
    if (textField.current) {
      textField.current.focus();
    }
  }, [todos]);

  const setErrorTitle = () => {
    dispatch({
      type: Actions.setErrorLoad,
      payload: 'Title should not be empty',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '') {
      setErrorTitle();

      return;
    }

    const preparingData = {
      id: 0,
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    };

    dispatch({ type: Actions.isAdding, status: true });
    dispatch({
      type: Actions.addTempTodo,
      preparingTodo: preparingData,
    });
    dispatch({ type: Actions.setErrorLoad, payload: '' });

    postTodos(title.trim())
      .then(newPost => {
        const typedNewPost = newPost as Todo;

        dispatch({
          type: Actions.postTodo,
          post: typedNewPost,
        });
        setTitle('');
      })
      .catch(error => {
        dispatch({
          type: Actions.setErrorLoad,
          payload: 'Unable to add a todo',
        });

        throw error;
      })
      .finally(() => {
        wait(0).then(() => {
          textField.current?.focus();
        });

        dispatch({ type: Actions.isAdding, status: false });

        dispatch({
          type: Actions.addTempTodo,
          preparingTodo: null,
        });
      });
  };

  const handleToggleAllTodos = () => {
    dispatch({ type: Actions.toggleAll, payload: true });
    Promise.all(
      (isIncompleted ? todos.filter(todo => !todo.completed) : todos).map(
        (todo: Todo) =>
          updateTodo({ id: todo.id, data: { completed: !todo.completed } })
            .then(response => {
              const responseTodo = response as Todo;

              dispatch({ type: Actions.markCompleted, id: responseTodo.id });
            })
            .catch(error => {
              dispatch({
                type: Actions.setErrorLoad,
                payload: 'Unable to delete a todo',
              });
              dispatch({ type: Actions.toggleAll, payload: false });
              throw error;
            })
            .finally(() => {
              dispatch({ type: Actions.toggleAll, payload: false });
            }),
      ),
    );
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllTodos}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={textField}
          data-cy="NewTodoField"
          value={title}
          onChange={e => setTitle(e.target.value)}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
