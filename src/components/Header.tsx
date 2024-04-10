import React, { useContext, useEffect, useRef, useState } from 'react';
import { TodosContext } from './TodosContext';
import { TEMPORARY_TODO_ID, USER_ID, addTodo, updateTodo } from '../api/todos';
import classNames from 'classnames';
import { Errors } from '../types/Errors';
import { hideError } from '../functions/hideError';
import { Todo } from '../types/Todo';

export const Header: React.FC = () => {
  const { todos, setTodos, setMessageError, loadingTodo, setLoadingTodo } =
    useContext(TodosContext);
  const [todoTitle, setTodoTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos.length, todoTitle]);

  const AddNewTodo = (
    title: string,
    completed = false,
    userId = USER_ID,
  ): Promise<void> => {
    setMessageError(Errors.NoError);

    setLoadingTodo([TEMPORARY_TODO_ID]);

    setTodos([
      ...todos,
      {
        title: title,
        completed: false,
        userId: USER_ID,
        id: TEMPORARY_TODO_ID,
      },
    ]);

    return addTodo({ title, completed, userId })
      .then(newTodo => setTodos([...todos, newTodo]))
      .catch(error => {
        setMessageError(Errors.CantAdd);
        setTodos(todos.filter(todo => todo.id !== TEMPORARY_TODO_ID));
        hideError(setMessageError);
        setTodoTitle(todoTitle.trim());
        throw error;
      })
      .finally(() => {
        setLoadingTodo([]);
      });
  };

  const handleSubmit = (event: React.FocusEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      setMessageError(Errors.EmptyTitle);
      hideError(setMessageError);

      return;
    }

    AddNewTodo(todoTitle.trim()).then(() => setTodoTitle(''));
  };

  const isAllComplited = todos.every(todo => todo.completed);

  const handleAllComplited = () => {
    setLoadingTodo(todos.filter(todo => !todo.completed).map(todo => todo.id));

    const editedTodo = (todo: Todo): Todo => {
      return {
        ...todo,
        completed: !isAllComplited ? true : !todo.completed,
      };
    };

    const changeRightTodos = () => {
      if (!isAllComplited) {
        return todos.filter(todo => !todo.completed);
      }

      return todos;
    };

    Promise.allSettled(
      changeRightTodos().map(todo => updateTodo(editedTodo(todo))),
    )
      .then(results => {
        if (results.every(result => result.status === 'fulfilled')) {
          setTodos(prevTodos => {
            return prevTodos.map(todo => {
              return {
                ...todo,
                completed: !isAllComplited ? true : !todo.completed,
              };
            });
          });
        } else {
          setMessageError(Errors.CantUpdate);
          hideError(setMessageError);
        }
      })
      .finally(() => {
        setLoadingTodo([]);
      });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllComplited,
          })}
          data-cy="ToggleAllButton"
          onClick={handleAllComplited}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          disabled={!!loadingTodo.length}
          value={todoTitle}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
