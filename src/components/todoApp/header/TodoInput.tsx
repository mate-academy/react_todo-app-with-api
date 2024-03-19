/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { DispatchContext, TodosContext } from '../Store';
import { USER_ID, addTodo, updateTodo } from '../../../api/todos';

export const TodoInput: React.FC = () => {
  const { todos, isTodoDeleted } = useContext(TodosContext);
  const dispatch = useContext(DispatchContext);
  const [inputText, setInputText] = useState('');
  const allCompleted = todos.every(todo => todo.completed);
  const [disabledInput, setDisabledInput] = useState(false);
  const inputRefAddTodo = useRef<HTMLInputElement>(null);
  const [disabledButtonToggleAll, setDisabledButtonToggleAll] = useState(false);
  const [toggleAll, setToggleAll] = useState(() =>
    todos.every(todo => todo.completed),
  );

  useEffect(() => {
    setToggleAll(todos.every(todo => todo.completed));
  }, [todos]);

  useEffect(() => {
    if (isTodoDeleted) {
      inputRefAddTodo.current?.focus();
      dispatch({ type: 'setIsTodoDeleted', payload: false });
    }

    if (inputRefAddTodo.current) {
      inputRefAddTodo.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTodoDeleted, disabledInput]);

  const handleToggleAll = () => {
    setDisabledButtonToggleAll(true);
    setToggleAll(!toggleAll);

    const toggleAllTodos = todos.filter(t => t.completed === toggleAll);

    toggleAllTodos.forEach(todo => {
      dispatch({ type: 'loading', payload: { load: true, id: todo.id } });
      updateTodo({
        ...todo,
        completed: !todo.completed,
      })
        .then(response => {
          dispatch({ type: 'toggleTodo', payload: response.id });
        })
        .catch(() => {
          dispatch({ type: 'setError', payload: 'Unable to update a todo' });
        })
        .finally(() => {
          dispatch({
            type: 'loading',
            payload: { load: false, id: todo.id },
          });
          const timeout = setTimeout(() => {
            dispatch({ type: 'setError', payload: null });
            clearTimeout(timeout);
          }, 3000);

          setDisabledButtonToggleAll(false);
        });
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputText.trim()) {
      dispatch({ type: 'setError', payload: 'Title should not be empty' });
      const timeout = setTimeout(() => {
        dispatch({ type: 'setError', payload: null });
        clearTimeout(timeout);
      }, 3000);

      return;
    }

    const todo = {
      id: 0,
      userId: USER_ID,
      title: inputText.trim(),
      completed: false,
      loading: true,
    };

    setDisabledInput(true);
    dispatch({ type: 'setTempTodo', payload: todo });

    addTodo(todo)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((response: any) => {
        const { id, userId, title, completed } = response;

        const todoFromServer = {
          id,
          userId,
          title,
          completed,
        };

        dispatch({ type: 'addTodo', payload: todoFromServer });
        setInputText('');
      })
      .catch(() => {
        dispatch({ type: 'setError', payload: 'Unable to add a todo' });
      })
      .finally(() => {
        setDisabledInput(false);
        dispatch({ type: 'setTempTodo', payload: null });

        setTimeout(() => {
          dispatch({ type: 'setError', payload: null });
        }, 3000);
      });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
          disabled={disabledButtonToggleAll || disabledInput}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          ref={inputRefAddTodo}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputText}
          onChange={handleInputChange}
          disabled={disabledInput || disabledButtonToggleAll}
        />
      </form>
    </header>
  );
};
