import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import * as todosService from '../../api/todos';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todoTitle: string;
  setTodoTitle: (newTitle: string) => void;
  setErrorMessage: (errorMessage: string) => void;
  loadingTodoIds: number[];
  setLoadingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTempTodo: (tempTodo: Todo | null) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  todoTitle,
  setTodoTitle,
  setErrorMessage,
  loadingTodoIds,
  setLoadingTodoIds,
  setTempTodo,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  });
  const completedTodos = todos.every(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  function addTodo(title: string) {
    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setErrorMessage('');

    const createdTempTodo = { id: 0, title: title, completed: false };

    setTempTodo(createdTempTodo);
    setLoadingTodoIds(prevTodoIds => [...prevTodoIds, createdTempTodo.id]);

    return todosService
      .postTodo({
        userId: todosService.USER_ID,
        title: title.trim(),
        completed: false,
      })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTodoTitle('');
      })
      .catch(() => {
        setErrorMessage(`Unable to add a todo`);
      })
      .finally(() => {
        setLoadingTodoIds(prevIds =>
          prevIds.filter(prevTodoId => prevTodoId !== createdTempTodo.id),
        );
        setTempTodo(null);
        if (titleField.current) {
          titleField.current.focus();
        }
      });
  }

  const handleToggleAll = () => {
    let todosToUpdate;

    if (completedTodos) {
      todosToUpdate = [...todos];
    } else {
      todosToUpdate = activeTodos;
    }

    todosToUpdate.forEach(todo => {
      setLoadingTodoIds(prevIds => [...prevIds, todo.id]);

      todosService
        .updateTodo({
          id: todo.id,
          userId: todosService.USER_ID,
          title: todo.title,
          completed: !todo.completed,
        })
        .then(updatedTodo => {
          setTodos(currentTodos =>
            currentTodos.map(currentTodo =>
              currentTodo.id === todo.id ? updatedTodo : currentTodo,
            ),
          );
        })
        .catch(() => {
          setErrorMessage(`Unable to update a todo`);
        })
        .finally(() => {
          setLoadingTodoIds(prevIds =>
            prevIds.filter(prevTodoId => prevTodoId !== todo.id),
          );
        });
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addTodo(todoTitle);
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: completedTodos,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={titleField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={e => setTodoTitle(e.target.value)}
          disabled={loadingTodoIds.length > 0}
        />
      </form>
    </header>
  );
};
