import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { TodosContext } from '../../contexts/TodosContext';

export const NewTodoField:React.FC = () => {
  const { addTodo, setError } = useContext(TodosContext);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const titleField = useRef<null | HTMLInputElement>(null);

  useEffect(() => titleField.current?.focus(), []);

  const handleAddNewTodo = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');
      titleField.current?.focus();

      return;
    }

    setIsAdding(true);

    const newTodo = {
      title: trimmedTitle,
      completed: false,
      userId: 12058,
      id: 0,
    };

    if (addTodo) {
      addTodo(newTodo)
        .then(
          () => setTitle(''),
        )
        .catch(() => setError('Unable to add a todo'))
        .finally(() => {
          setIsAdding(false);
          titleField.current?.focus();
        });
    }
  };

  return (
    <form onSubmit={handleAddNewTodo}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        aria-label="Enter New todo"
        ref={titleField}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={isAdding}
      />
    </form>
  );
};
