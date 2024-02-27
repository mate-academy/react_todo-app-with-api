/* eslint-disable jsx-a11y/control-has-associated-label */
import { useContext, useState } from 'react';
import { DispatchContext, StateContext } from './TodosContext';
import { createPost, updateTodo } from '../api/todos';

export const Header = () => {
  const { todos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const [title, setTitle] = useState('');
  const USER_ID = 56;

  const completedTodos = todos.filter(todo => todo.completed);
  const notCompletedTodos = todos.filter(todo => !todo.completed);
  const isAllCompleted = todos.every(todo => todo.completed);
  const toggleAllTodos = isAllCompleted ? completedTodos : notCompletedTodos;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      dispatch({
        type: 'errorMessage',
        payload: 'Title should not be empty',
      });

      return;
    }

    dispatch({
      type: 'setLoading',
      payload: {
        isLoading: true,
        todoIds: [0],
      },
    });

    dispatch({
      type: 'addTempTodo',
      payload: {
        title,
        completed: false,
        id: 0,
        userId: USER_ID,
      },
    });

    createPost({
      title,
      completed: false,
      userId: USER_ID,
    })
      .then(response => {
        dispatch({
          type: 'addTodo',
          payload: response,
        });
        setTitle('');
      })
      .catch(() => {
        dispatch({
          type: 'hasError',
          payload: true,
        });

        dispatch({
          type: 'errorMessage',
          payload: 'Unable to add a todo',
        });
      })
      .finally(() => {
        dispatch({
          type: 'setLoading',
          payload: {
            isLoading: false,
          },
        });

        dispatch({
          type: 'addTempTodo',
          payload: null,
        });
      });
  };

  const handleChooseAll = () => {
    todos.forEach(todo => {
      const updatedTodo = { ...todo, completed: !isAllCompleted };

      dispatch({
        type: 'setLoading',
        payload: {
          isLoading: true,
          todoIds: toggleAllTodos.map(item => item.id),
        },
      });

      updateTodo(updatedTodo)
        .then(() => {
          dispatch({
            type: 'changeTodo',
            payload: updatedTodo,
          });
        })
        .catch(() => {
          dispatch({
            type: 'hasError',
            payload: true,
          });

          dispatch({
            type: 'errorMessage',
            payload: 'Unable to update a todo',
          });
        })
        .finally(() => {
          dispatch({
            type: 'setLoading',
            payload: {
              isLoading: false,
            },
          });
        });
    });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        onClick={handleChooseAll}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          ref={input => input?.focus()}
        />
      </form>
    </header>
  );
};
