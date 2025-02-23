import { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';
import classNames from 'classnames';

interface Props {
  todos: Todo[];
  filteredTodos: Todo[];
  onAddTodo: (todo: Todo) => Promise<void>;
  onErrorMessage: (error: string) => void;
  onTempTodo: (todo: Todo | null) => void;
  onBulkUpdate: (todoArr: Todo[], status: boolean) => void;
  focusInput: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoForm: React.FC<Props> = ({
  todos,
  filteredTodos,
  onAddTodo,
  onErrorMessage,
  onTempTodo,
  focusInput,
  inputRef,
  onBulkUpdate,
}) => {
  const [todo, setTodo] = useState('');
  const [disableInput, setDisableInput] = useState(false);
  const completedTodos = filteredTodos.filter(t => t.completed);
  const activeTodos = filteredTodos.filter(t => !t.completed);

  const handleBulkCheck = () => {
    if (completedTodos.length === filteredTodos.length) {
      onBulkUpdate(completedTodos, false);
    } else {
      onBulkUpdate(activeTodos, true);
    }
  };

  const handleInput = (evnt: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(evnt.target.value);
    setDisableInput(false);

    return;
  };

  const resetForm = () => {
    setTodo('');
  };

  const handleSubmit = async (evnt: React.FormEvent<HTMLFormElement>) => {
    evnt.preventDefault();
    setDisableInput(true);

    if (!todo.trim()) {
      onErrorMessage('Title should not be empty');
      setDisableInput(false);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: todo.trim(),
      completed: false,
    };

    onTempTodo(newTodo);

    try {
      await onAddTodo(newTodo);
      setDisableInput(false);
      resetForm();
      onTempTodo(null);
      focusInput();
    } catch (error) {
      setDisableInput(false);
      onTempTodo(null);
      onErrorMessage('Unable to add a todo');
    }
  };

  useEffect(() => {
    if (!disableInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disableInput, inputRef]);

  return (
    <>
      {!!todos.length && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            completedTodos.length === todos.length && 'active',
          )}
          data-cy="ToggleAllButton"
          onClick={handleBulkCheck}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          disabled={disableInput}
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todo}
          onChange={handleInput}
        />
      </form>
    </>
  );
};
