import cn from 'classnames';
import { useCallback, useContext, useState } from 'react';
import { ErrorMessage, Todo } from '../types';
import { USER_ID, addTodo, patchTodo } from '../api/todos';
import { TEMP_ITEM_ID } from '../utils';
import { SetErrorMessageContext, TodosContext } from '../contexts';

type Props = {
  setTempTodo: (tempTodo: Todo | null) => void;
  toggledAllCompleted: boolean;
};

export const Header: React.FC<Props> = ({
  setTempTodo,
  toggledAllCompleted,
}) => {
  const [title, setTitle] = useState('');
  const { todosContext, setTodosContext } = useContext(TodosContext);
  const setErrorMessage = useContext(SetErrorMessageContext);

  const { todos, inputFieldRef } = todosContext;
  const handleToggleAllStatusClick = useCallback(() => {
    setErrorMessage(ErrorMessage.noError);
    setTodosContext(prevTodosContext => ({
      ...prevTodosContext,
      isChangingStatus: true,
    }));

    const updatedTodosPromises = todos.map(async todo => {
      if (todo.completed === !toggledAllCompleted) {
        return todo;
      }

      const updatedTodo = {
        ...todo,
        completed: !toggledAllCompleted,
      };

      try {
        await patchTodo(updatedTodo);

        return updatedTodo;
      } catch {
        setErrorMessage(ErrorMessage.update);

        return todo;
      }
    });

    Promise.all(updatedTodosPromises)
      .then(updatedTodos =>
        setTodosContext(prevTodos => ({
          ...prevTodos,
          todos: updatedTodos,
        })),
      )
      .finally(() =>
        setTodosContext(prevTodos => ({
          ...prevTodos,
          isChangingStatus: false,
        })),
      );
  }, [todos, toggledAllCompleted, setErrorMessage, setTodosContext]);

  const submitTodo = (e: React.FormEvent) => {
    e.preventDefault();

    const preparedTitle = title.trim();

    if (!preparedTitle) {
      setErrorMessage(ErrorMessage.title);

      return;
    }

    const todoToAdd = {
      title: preparedTitle,
      userId: USER_ID,
      completed: false,
    };

    if (inputFieldRef?.current) {
      inputFieldRef.current.disabled = true;
    }

    setErrorMessage(ErrorMessage.noError);
    setTempTodo({
      ...todoToAdd,
      id: TEMP_ITEM_ID,
    });

    addTodo(todoToAdd)
      .then(todo => {
        setTodosContext(prevTodosContext => ({
          ...prevTodosContext,
          todos: todos.concat(todo),
        }));
        setTitle('');
      })
      .catch(() => setErrorMessage(ErrorMessage.add))
      .finally(() => {
        if (inputFieldRef?.current) {
          inputFieldRef.current.disabled = false;
          inputFieldRef.current.focus();
        }

        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: toggledAllCompleted,
          })}
          data-cy="ToggleAllButton"
          aria-label="toggle All todos"
          onClick={handleToggleAllStatusClick}
        />
      )}

      <form onSubmit={submitTodo}>
        <input
          data-cy="NewTodoField"
          value={title}
          onChange={e => setTitle(e.target.value)}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          ref={inputFieldRef}
        />
      </form>
    </header>
  );
};
