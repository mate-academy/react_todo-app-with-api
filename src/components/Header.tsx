/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { DispatchContext, StateContext } from './TodosContext';
import { USER_ID } from '../utils/constants';
import { createTodo, updateTodo } from '../api/todos';

export const Header: React.FC = () => {
  const { todos, loading } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [title, setTitle] = useState('');

  const completedTodos = todos.filter(todo => todo.completed);
  const notCompletedTodos = todos.filter(todo => !todo.completed);
  const isAllCompleted = todos.every(todo => todo.completed);
  const toggleAllTodos = isAllCompleted ? completedTodos : notCompletedTodos;

  const handleChangeAllCompleted = () => {
    dispatch({
      type: 'setLoading',
      payload: {
        isLoading: true,
        todoIds: toggleAllTodos.map(todo => todo.id),
      },
    });

    Promise.allSettled(
      toggleAllTodos.map(todo => updateTodo({
        ...todo,
        completed: !isAllCompleted,
      })
        .then(() => todo)),
    )
      .then(results => {
        results.forEach(result => {
          if (result.status === 'fulfilled') {
            dispatch({
              type: 'changeTodo',
              payload: { ...result.value, completed: !isAllCompleted },
            });
          }

          if (result.status === 'rejected') {
            dispatch({
              type: 'setErrorMessage',
              payload: 'Unable to update a todo',
            });
          }
        });
      })
      .finally(() => dispatch({
        type: 'setLoading',
        payload: { isLoading: false },
      }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newTitle = title.trim();

    if (!newTitle) {
      dispatch({
        type: 'setErrorMessage',
        payload: 'Title should not be empty',
      });

      return;
    }

    dispatch({
      type: 'setLoading',
      payload: { isLoading: true, todoIds: [0] },
    });

    dispatch({
      type: 'addTempTodo',
      payload: {
        title: newTitle,
        id: 0,
        completed: false,
        userId: USER_ID,
      },
    });

    createTodo({
      title: newTitle,
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
      .catch(() => dispatch({
        type: 'setErrorMessage',
        payload: 'Unable to add a todo',
      }))
      .finally(() => {
        dispatch({
          type: 'setLoading',
          payload: { isLoading: false },
        });
        dispatch({
          type: 'addTempTodo',
          payload: null,
        });
      });
  };

  const todoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoInput.current) {
      todoInput.current.focus();
    }
  });

  return (
    <header className="todoapp__header">
      {loading && todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleChangeAllCompleted}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={todoInput}
          value={title}
          onChange={handleChange}
          disabled={loading.isLoading}
        />
      </form>
    </header>
  );
};
