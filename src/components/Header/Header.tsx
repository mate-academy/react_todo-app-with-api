import {
  FC, memo, useEffect, useRef, useState, useContext,
} from 'react';
import {
  getTodosByCompletion, updateTodoStatus, addTodo,
} from '../../api/todos';
import { TodoErrors } from '../../types/ErrorMessages';
import { AuthContext } from '../Auth/AuthContext';
import { Todo } from '../../types/Todo';

interface Props {
  onMultipleLoad: React.Dispatch<React.SetStateAction<number[]>>
  onError: React.Dispatch<React.SetStateAction<TodoErrors>>,
  onAdd: (id: number) => Promise<void>,
  todosFromServer: Todo[],
}

export const Header: FC<Props> = memo(({
  onError, onAdd, todosFromServer, onMultipleLoad,
}) => {
  const [input, setInput] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const newTodoField = useRef<HTMLInputElement>(null);

  const user = useContext(AuthContext);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user && input.trim().length > 0) {
      setIsAdding(true);

      const newTodo = {
        userId: user.id,
        title: input,
        completed: false,
      };

      try {
        await addTodo(newTodo);
        onAdd(user.id);
      } catch (error) {
        onError(TodoErrors.onAdd);
      } finally {
        setIsAdding(false);
      }
    } else {
      onError(TodoErrors.onEmptyTitle);
    }

    setInput('');
  };

  const completedTodos = getTodosByCompletion(todosFromServer, true);
  const isAllDone = completedTodos.length === todosFromServer.length;

  const handleToggleAll = async () => {
    const todosToUpdate = getTodosByCompletion(todosFromServer, isAllDone);

    onMultipleLoad(todosToUpdate.map(todo => todo.id));

    const updatePromises = todosToUpdate
      .map(todo => updateTodoStatus(todo.id, !todo.completed));

    try {
      await Promise.all(updatePromises);

      if (user) {
        onAdd(user.id);
      }
    } catch (error) {
      onError(TodoErrors.onUpdate);
    } finally {
      onMultipleLoad([]);
    }
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={`todoapp__toggle-all ${isAllDone ? 'active' : ''}`}
        onClick={handleToggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          name="title"
          value={input}
          onChange={handleInputChange}
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
