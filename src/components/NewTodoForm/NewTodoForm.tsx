import { FormEvent, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { StateSetter } from '../../types/StateSetter';
import { createTodo, USER_ID } from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessage';

interface Props {
  setTodos: StateSetter<Todo[]>;
  setError: (msg: string, timeout?: number) => void;
  setTempTodo: StateSetter<Todo | null>;
  todos: Todo[];
}

export const NewTodoForm: React.FC<Props> = ({
  setTodos,
  setError,
  setTempTodo,
  todos,
}) => {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const newTodoField = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(ErrorMessage.NONE);
    setSubmitting(true);
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ErrorMessage.EMPTY_TITLE, 3000);
      setSubmitting(false);

      return;
    }

    const newTodoData = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({ id: 0, ...newTodoData });
    createTodo({ ...newTodoData })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => setError(ErrorMessage.ADD, 3000))
      .finally(() => {
        setSubmitting(false);
        setTempTodo(null);
      });
  };

  useEffect(() => {
    if (!submitting) {
      newTodoField.current?.focus();
    }
  }, [submitting, todos.length]);

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        data-cy="NewTodoField"
        name="title"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={newTodoField}
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={submitting}
      />
    </form>
  );
};
