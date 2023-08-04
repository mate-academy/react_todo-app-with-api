import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoError } from '../types/TodoError';
import { USER_ID } from '../api/todos';
import * as todoService from '../api/todos';
import { wait } from '../utils/fetchClient';

type Props = {
  todos: Todo[],
  setErrorMesage: (errorMesage: TodoError) => void,
  setTodosFromServer: (todos: Todo[]) => void,
  setChangedStatusIds: (ids: number[]) => void,
  setNewAddedTodoId: (id: number | null) => void,
};

export const Header: React.FC<Props> = ({
  todos,
  setErrorMesage,
  setTodosFromServer,
  setChangedStatusIds,
  setNewAddedTodoId,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const todoTemp = {
    id: 0,
    title: todoTitle,
    completed: false,
    userId: USER_ID,
  };

  const addTodo = useCallback(({ title, userId, completed }: Todo) => {
    setIsInputDisabled(true);

    return todoService.createTodo({ title, userId, completed })
      .then(newTodo => {
        setTodosFromServer([...todos, newTodo]);
        setNewAddedTodoId(newTodo.id);
      })
      .catch(() => setErrorMesage(TodoError.add))
      .finally(() => {
        setTodoTitle('');

        wait(300)
          .then(() => {
            setIsInputDisabled(false);
            setNewAddedTodoId(null);
          });
      });
  }, [todos]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (todoTemp.title.trim() !== '') {
        addTodo(todoTemp);
      } else {
        setErrorMesage(TodoError.emtyTitle);
      }
    }
  };

  const areAllCompleted = () => {
    return todos.every((todo) => todo.completed);
  };

  const updateSelectedTodoId = () => {
    const differentStatusTodos = todos.filter(
      (todo) => todo.completed === areAllCompleted(),
    );

    const ids = differentStatusTodos.map((todo) => todo.id);

    setChangedStatusIds(ids);
  };

  const toggleAllTodos = useCallback(async () => {
    const newStatus = !areAllCompleted();

    const updatedTodos = todos.map(todo => {
      return ({
        ...todo,
        completed: newStatus,
      });
    });

    updateSelectedTodoId();

    try {
      await Promise.all(
        updatedTodos.map(updateTodo => todoService.updateTodo(updateTodo)),
      );
      setTodosFromServer(updatedTodos);
    } catch {
      setErrorMesage(TodoError.update);
    } finally {
      setChangedStatusIds([]);
    }
  }, [todos]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: areAllCompleted() },
        )}
        aria-label="toggle"
        onClick={toggleAllTodos}
      />

      <form>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
          onKeyDown={event => handleKeyPress(event)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
