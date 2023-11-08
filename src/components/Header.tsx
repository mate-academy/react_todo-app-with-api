/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useState,
} from 'react';
import cn from 'classnames';
import { TodosContext } from '../context/TodosContext';
import { ErrorType } from '../types/ErrorType';
import { addTodo } from '../api/todos';
import { Todo } from '../types/Todo';

export const Header: React.FC = () => {
  const [title, setTitle] = useState('');
  const {
    setError,
    setTempTodo,
    setTodos,
    todos,
    tempTodo,
    handleToggleAll,
    USER_ID,
    inputRef,
  } = useContext(TodosContext);

  const isChecked = todos.every(todo => todo.completed);

  const beforeResponse = () => {
    return setTempTodo({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, [inputRef]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError(ErrorType.EmptyTitle);
    } else {
      beforeResponse();

      const newTodo: Omit<Todo, 'id'> = {
        title: title.trim(),
        completed: false,
        userId: USER_ID,
      };

      try {
        const todo = await addTodo(newTodo);

        setTitle('');
        setTempTodo(null);
        setTodos([...todos, todo]);
      } catch {
        beforeResponse();
        setError(ErrorType.Add);
      } finally {
        setTimeout(() => {
          inputRef?.current?.focus();
        }, 0);
        setTempTodo(null);
      }
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: isChecked })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          ref={inputRef}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
