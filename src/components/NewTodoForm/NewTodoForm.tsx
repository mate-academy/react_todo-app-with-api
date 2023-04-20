import React, { useCallback, useContext, useState } from 'react';

import { postTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { AppContext } from '../AppContext';

const createTodo = (title: string, userId: number) => {
  const newTodo: Omit<Todo, 'id'> = {
    userId,
    title,
    completed: false,
  };

  return newTodo;
};

export const NewTodoForm: React.FC = React.memo(() => {
  const [todoTitle, setTitle] = useState('');
  const [shouldBeDisabled, setShouldBeDisabled] = useState(false);

  const {
    userId,
    todos,
    setTempTodo,
    setTodos,
    showError,
    setErrorMessage,
  } = useContext(AppContext);

  const postNewTodo = useCallback(async (title: string) => {
    try {
      setErrorMessage('');
      setShouldBeDisabled(true);

      const newTodo = createTodo(title, userId);

      setTempTodo({
        ...newTodo,
        id: 0,
      });

      const addedTodo = await postTodo(newTodo);

      setTodos(prevState => [...prevState, addedTodo]);
      setTitle('');
    } catch (error) {
      showError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setShouldBeDisabled(false);
    }
  }, [todos]);

  const handleTItleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.currentTarget.value);
    },
    [],
  );

  const handleTodoAddition = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = todoTitle.trim();

    if (trimmedTitle) {
      postNewTodo(trimmedTitle);
    } else {
      setTitle('');
      showError('Title can\'t be empty');
    }
  };

  return (
    <form
      onSubmit={handleTodoAddition}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoTitle}
        onChange={handleTItleChange}
        disabled={shouldBeDisabled}
      />
    </form>
  );
});
