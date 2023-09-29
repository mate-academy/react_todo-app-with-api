import React, {
  FormEvent, useEffect, useState,
} from 'react';
import { addTodo } from '../api/todos';
import { TodoAdd } from '../types/Todo';
import { TContext, useTodoContext } from '../context/TodoContext';

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

  useEffect(() => {
    if (!isSubmitting) {
      titleInputRef.current?.focus();
    }
  }, [isSubmitting]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTodo: TodoAdd = {
      userId: 11550,
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
          // eslint-disable-next-line no-console
          console.log(res);
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
