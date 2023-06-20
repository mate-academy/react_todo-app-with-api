/* eslint-disable jsx-a11y/control-has-associated-label */

import {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../types/Todo';
import { ErrorType } from '../types/ErrorType';
import { getTodoId } from '../utils/functionsHelper';
import { updateTodo } from '../api/todos';

const USER_ID = 10632;

type HeaderProps = {
  todos: Todo[],
  loadingIds: number[],
  updateTodos: (todoList: Todo[]) => void,
  updateError: (error: ErrorType) => void,
  postNewTodo: (newTodo: Todo) => void,
  addTempTodo: (todo: Todo) => void,
  updateLoadingStatus: (id: React.SetStateAction<number[]>) => void,
};

export const Header: React.FC<HeaderProps> = ({
  todos,
  loadingIds,
  updateTodos,
  updateError,
  postNewTodo,
  addTempTodo,
  updateLoadingStatus,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAllCompleted, setIsAllCompleted] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(e.target.value);
  };

  const handleMarkAllTodos = () => {
    const todosPromises: Array<Promise<Todo>> = [];

    const allTodosToCompleted = todos.map(todo => {
      updateLoadingStatus(prevLoadingIds => [...prevLoadingIds, todo.id]);
      const updatedTodo = {
        ...todo,
        completed: !isAllCompleted,
      };

      todosPromises.push(updateTodo(updatedTodo.id, updatedTodo));

      return updatedTodo;
    });

    Promise.all(todosPromises)
      .then(todosFromServer => {
        updateTodos(todosFromServer);
      })
      .catch(() => {
        updateError(ErrorType.update);
      })
      .finally(() => {
        updateLoadingStatus([]);
      });

    setIsAllCompleted(!isAllCompleted);

    updateTodos(allTodosToCompleted);
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!newTodoTitle.trim()) {
        updateError(ErrorType.add);
      } else {
        const newTodo = {
          completed: false,
          id: getTodoId(),
          userId: USER_ID,
          title: newTodoTitle,
        };

        updateLoadingStatus([...loadingIds]);
        addTempTodo({ ...newTodo, id: 0 });
        setNewTodoTitle('');
        postNewTodo(newTodo);
      }
    }
  };

  useEffect(() => {
    if (inputRef.current && todos.length) {
      inputRef.current.focus();
    }
  }, [todos.length, loadingIds]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          onClick={handleMarkAllTodos}
        />
      )}

      <form onSubmit={(e) => e.preventDefault()}>
        <input
          ref={inputRef}
          disabled={loadingIds.length > 0}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleInputChange}
          onKeyDown={handleOnKeyDown}
        />
      </form>
    </header>
  );
};
