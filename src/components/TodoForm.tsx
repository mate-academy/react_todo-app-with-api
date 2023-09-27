import React, {
  FormEvent, useEffect, useState,
} from 'react';
import { addTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { TContext, useTodoContext } from './TodoContext';

export const TodoForm: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const {
    todos,
    setTodos,
    handleError,
    setTempTodos,
    titleInputRef,
  } = useTodoContext() as TContext;

  let counter: number;

  useEffect(() => {
    if (!isSubmitting) {
      titleInputRef.current?.focus();
    }
  }, [isSubmitting]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTodo: Todo = {
      userId: 11550,
      id: 123 + counter,
      title: title.trim(),
      completed: false,
    };

    if (title.trim().length === 0) {
      handleError('Title should not be empty');
    } else {
      setTempTodos({ ...newTodo, id: 0 });
      setIsSubmitting(true);

      addTodo(newTodo)
        .then((res) => {
          setTodos([...todos, res]);
          setTitle('');
        })
        .catch((error) => {
          handleError('Unable to add a todo');
          // eslint-disable-next-line no-console
          console.log(error);
        })
        .finally(() => {
          setIsSubmitting(false);
          setTempTodos(null);
          counter += 1;
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        key="key-input-1"
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={isSubmitting}
        ref={titleInputRef}
      />
    </form>
  );
};
