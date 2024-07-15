import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Errors } from '../../types/Errors';
import { addTodo, updateTodo, USER_ID } from '../../api/todos';
import { DispatchContext, StateContext } from '../../context/StateContext';

export const Header: React.FC = () => {
  const { todos, loadingTodos, error } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [disableInput, setDisableInput] = useState(false);

  const newTodoInput = useRef<HTMLInputElement>(null);

  const activeToggleAll = todos.every(todo => todo.completed) && !!todos.length;

  const focusNewTodoInput = () => {
    if (newTodoInput.current) {
      newTodoInput.current.focus();
    }
  };

  const handleNewTodoFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (disableInput) {
      return;
    }

    const newTitle = newTodoTitle.trim();

    if (!newTitle) {
      dispatch({
        type: 'error',
        payload: Errors.emptyTitle,
      });

      return;
    }

    setDisableInput(true);

    const newTodo = {
      title: newTitle,
      userId: USER_ID,
      completed: false,
    };

    dispatch({
      type: 'addTempTodo',
      payload: { ...newTodo, id: 0 },
    });
    dispatch({
      type: 'loadingTodos',
      payload: [0],
    });

    try {
      const createdTodo = await addTodo(newTodo).then(response => response);

      dispatch({
        type: 'addTodo',
        payload: createdTodo,
      });

      setNewTodoTitle('');
    } catch (err) {
      dispatch({
        type: 'error',
        payload: Errors.todoCreate,
      });
    } finally {
      setDisableInput(false);
      dispatch({
        type: 'addTempTodo',
        payload: null,
      });
      dispatch({
        type: 'loadingTodos',
        payload: [0],
      });
    }
  };

  const handleToggleAll = async () => {
    const statusShouldBe = todos.some(todo => !todo.completed);
    const todosToUpdate = todos
      .filter(todo => todo.completed !== statusShouldBe)
      .map(todo => {
        return { ...todo, completed: statusShouldBe };
      });

    dispatch({
      type: 'loadingTodos',
      payload: todosToUpdate.map(todo => todo.id),
    });

    const promises = todosToUpdate.map(todo => {
      return updateTodo({ ...todo, completed: todo.completed }).then(
        () => todo,
      );
    });
    const updatedResults = await Promise.allSettled(promises);
    let withError = false;

    const updatedTodos = updatedResults.reduce((acc: number[], result) => {
      if (result.status === 'rejected') {
        withError = true;

        return acc;
      }

      acc.push(result.value.id);

      return acc;
    }, []);

    if (withError) {
      dispatch({
        type: 'error',
        payload: Errors.todoUpdate,
      });
    }

    dispatch({
      type: 'setTodos',
      payload: todos.map(todo => {
        if (updatedTodos.includes(todo.id)) {
          return { ...todo, completed: statusShouldBe };
        }

        return todo;
      }),
    });
    dispatch({
      type: 'loadingTodos',
      payload: loadingTodos.filter(
        id => !todosToUpdate.map(todo => todo.id).includes(id),
      ),
    });
  };

  useEffect(() => {
    focusNewTodoInput();
  }, [todos, error]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: activeToggleAll,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleNewTodoFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={newTodoInput}
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value)}
          disabled={disableInput}
        />
      </form>
    </header>
  );
};
