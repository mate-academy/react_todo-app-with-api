import React, { useEffect, useRef, useState } from 'react';
import { USER_ID, postTodos } from '../api/todos';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  onAdd: (todo: Todo) => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  handleCompletedStatus: (id: number) => void;
  isActive: boolean;
  isSubmittingEnter: boolean;
  setIsSubmittingEnter: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  onAdd,
  setErrorMessage,
  setTempTodo,
  handleCompletedStatus,
  isActive,
  isSubmittingEnter,
  setIsSubmittingEnter,
}) => {
  const field = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAllCompletedStatus = (todoList: Todo[]) => {
    const hasIncompleteTodos = todoList.some(todo => !todo.completed);

    todoList.forEach(todo => {
      if (todo.completed !== hasIncompleteTodos) {
        handleCompletedStatus(todo.id);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title.replace(/\s+/g, '').length === 0) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(null), 3000);
    } else {
      setIsSubmitting(true);
      const todo = {
        title: title.trim(),
        userId: USER_ID,
        completed: false,
        id: 0,
      };

      setTempTodo(todo);
      postTodos(title.trim())
        .then(newTodo => {
          onAdd(newTodo);
          setTitle('');
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
          setTimeout(() => setErrorMessage(null), 3000);
        })
        .finally(() => {
          setIsSubmitting(false);
          setTempTodo(null);
          setIsSubmittingEnter(!isSubmittingEnter);
        });
    }
  };

  useEffect(() => {
    field.current?.focus();
  }, [isSubmittingEnter]);

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: isActive })}
          data-cy="ToggleAllButton"
          onClick={() => handleAllCompletedStatus(todos)}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          ref={field}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={element => setTitle(element.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
