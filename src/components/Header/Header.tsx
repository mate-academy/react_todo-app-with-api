import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../../types/todo';
import { USER_ID, addTodo } from '../../api/todos';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setLoadingTodoIds: (value: Set<number>) => void;
  setErrorMessage: (message: string) => void;
  setTempTodo: (tempTodo: Todo | null) => void;
  changeTodoStatus: (todo: Todo) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  setLoadingTodoIds,
  setErrorMessage,
  setTempTodo,
  changeTodoStatus,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const allTodosCompleted = todos.every(todo => todo.completed);

  // focus on the input field when it's not submitting and todos length changes
  useEffect(() => {
    if (!isSubmitting && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSubmitting, todos.length]);

  // handle form submission to add a new todo
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = newTitle.trim();

    if (!title) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    setIsSubmitting(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    addTodo({ title, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setNewTitle('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
        setTempTodo(null);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // handle toggle of all todos completion status
  const handleToggle = async () => {
    const allNotCompletedTodos = todos.filter(todo => !todo.completed);

    //sets todos ids which being updated (this enables the loader to be turned on in TodoItem.tsx) and changing todo status
    if (allTodosCompleted) {
      setLoadingTodoIds(new Set(todos.map(todo => todo.id)));
      await Promise.all(
        todos.map(todo => changeTodoStatus({ ...todo, completed: false })),
      );
    } else {
      setLoadingTodoIds(new Set(allNotCompletedTodos.map(todo => todo.id)));
      await Promise.all(
        allNotCompletedTodos.map(todo =>
          changeTodoStatus({ ...todo, completed: true }),
        ),
      );
    }

    setLoadingTodoIds(new Set());
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggle}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={newTitle}
          onChange={event => setNewTitle(event.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
