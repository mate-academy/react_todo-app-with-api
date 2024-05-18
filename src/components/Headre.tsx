import { Dispatch, FC, FormEvent, useEffect, useState } from 'react';
import { USER_ID, addTodo, updateTodos } from '../api/todos';

import { Todo } from '../types/Todo';
import useFocusInput from '../hooks/useFocusInput';

interface Props {
  onErrorMessage: (message: string) => void;
  errorMessage: string;
  setTodos: Dispatch<React.SetStateAction<Todo[]>>;
  setTempTodo: Dispatch<React.SetStateAction<Todo | null>>;
  deletingId: number;
  todos: Todo[];
  setUpdatingTodoId: Dispatch<React.SetStateAction<number>>;
}

const Header: FC<Props> = ({
  onErrorMessage,
  setTodos,
  setTempTodo,
  deletingId,
  todos,
}) => {
  const inputRef = useFocusInput();
  const [title, setTitle] = useState('');
  const [isSendingTodo, setIsSendingTodo] = useState(false);

  const allCompleted = todos.every(todo => todo.completed);

  useEffect(() => {
    if (!isSendingTodo) {
      inputRef.current?.focus();
    }
  }, [title, isSendingTodo, inputRef]);

  useEffect(() => {
    if (deletingId) {
      inputRef.current?.focus();
    }
  }, [inputRef, deletingId]);

  const addNewTodo = async () => {
    setIsSendingTodo(true);

    const newTodo: Omit<Todo, 'id'> = {
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    try {
      const createdTodo = await addTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
      setTitle('');
    } catch {
      onErrorMessage('Unable to add a todo');
    } finally {
      setIsSendingTodo(false);
      setTempTodo(null);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      onErrorMessage('Title should not be empty');

      return;
    }

    addNewTodo();
  };

  const handleToggleCompleted = async () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !areAllCompleted,
    }));

    const todosToUpdate = todos.filter(
      todo => todo.completed === areAllCompleted,
    );

    try {
      await Promise.all(
        todosToUpdate.map(todo =>
          updateTodos(todo.id, { ...todo, completed: !areAllCompleted }),
        ),
      );
      setTodos(updatedTodos);
    } catch {
      onErrorMessage('Unable to update a todo');
    }
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allCompleted && 'active'}`}
          data-cy="ToggleAllButton"
          onClick={handleToggleCompleted}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isSendingTodo}
        />
      </form>
    </header>
  );
};

export default Header;
