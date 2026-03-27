import { useRef } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { addTodo, patchTodo, USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../../store/TodoContext';
import { ErrorContext } from '../../store/ErrorContext';
import classNames from 'classnames';
import { LoadingContext } from '../../store/LoadingContext';

type Props = {
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
};

export const Header: React.FC<Props> = ({ setTempTodo }) => {
  const { showError } = useContext(ErrorContext);
  const { setLoadingIds } = useContext(LoadingContext);
  const { todos, setTodos } = useContext(TodoContext);
  const [newTodo, setNewTodo] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const todosAreToggle = todos
    .filter(item => !item.completed)
    .every(item => item.completed);

  const sendTodo = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTodo = newTodo.trim();

    if (!trimmedTodo) {
      showError('Title should not be empty');

      return;
    }

    const data = {
      title: trimmedTodo,
      userId: USER_ID,
      completed: false,
    };

    try {
      setTempTodo({ ...data, id: 0 });
      setDisabled(true);
      const created = await addTodo(data);

      if (!created || !created.id) {
        throw new Error('Invalid response from server');
      }

      setTodos(prev => [...prev, created]);
      setNewTodo('');
    } catch (err) {
      showError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setDisabled(false);
    }
  };

  const toggleAll = async () => {
    const idsToToggle = todos
      .filter(item => item.completed === todosAreToggle)
      .map(item => item.id);

    setLoadingIds(idsToToggle);

    const results = await Promise.allSettled(
      idsToToggle.map(item => patchTodo(item, { completed: !todosAreToggle })),
    );

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const todoId = idsToToggle[index];

        setTodos(prev =>
          prev.map(item =>
            item.id === todoId ? { ...item, completed: !todosAreToggle } : item,
          ),
        );
      } else {
        showError('Unable to update a todo');
      }
    });

    setLoadingIds([]);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, disabled]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todosAreToggle,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={sendTodo}>
        <input
          disabled={disabled}
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={event => setNewTodo(event.target.value)}
        />
      </form>
    </header>
  );
};
