import React, {
  useState, useRef, useEffect, RefObject,
} from 'react';
import { Todo } from '../types/Todo';
import { createTodo } from '../api/todos';

type Props = {
  USER_ID: number;
  addNewTodo: (item: Todo) => void;
  showErrorNotification: (value: string) => void;
  setTempTodo: (item: Todo | null) => void;
  todos: Todo[];
};

export const Form: React.FC<Props> = ({
  USER_ID,
  addNewTodo,
  showErrorNotification,
  setTempTodo,
  todos,
}) => {
  const formRef: RefObject<HTMLInputElement> = useRef(null);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    formRef.current?.focus();
  }, [todos.length]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim().length < 1) {
      showErrorNotification('Title should not be empty');

      return;
    }

    setIsLoading(true);

    const newTodo: Todo = {
      userId: USER_ID,
      id: 0,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTodo);

    createTodo(newTodo)
      .then((todo) => {
        addNewTodo(todo);
        setTitle('');
      })
      .catch(() => {
        showErrorNotification('Unable to add a todo');
        formRef.current?.focus();
      })
      .finally(() => {
        setIsLoading(false);
        setTimeout(() => {
          formRef.current?.focus();
        }, 0);

        setTempTodo(null);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        data-cy="NewTodoField"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        ref={formRef}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isLoading}
      />
    </form>
  );
};
