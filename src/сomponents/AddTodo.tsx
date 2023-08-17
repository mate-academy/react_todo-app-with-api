import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  filteredTodosCount: number;
  todos: Todo[];
  createTodo: (newTodo: string) => Promise<void>;
  changeTodo: (todo: Todo) => void;
  setError: (error: string) => void;
};

export const AddTodo: React.FC<Props> = ({
  filteredTodosCount,
  todos,
  createTodo,
  changeTodo,
  setError,
}) => {
  const [title, setTitle] = useState('');
  const [disableInput, setDisableInput] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setDisableInput(true);
    const newTitle = title.trim();

    if (!newTitle) {
      setError('Title can\'t be empty');
      setDisableInput(false);
      setTitle('');

      return;
    }

    createTodo(newTitle)
      .finally(() => {
        setDisableInput(false);
        setTitle('');
      });
  };

  const handleToggleAll = () => {
    const isAnyActive = todos.some(item => !item.completed);

    todos.forEach(todo => {
      if (todo.completed !== isAnyActive) {
        changeTodo({ ...todo, completed: isAnyActive });
      }
    });
  };

  return (
    <header className="todoapp__header">
      {!!filteredTodosCount && (
        <button
          type="button"
          aria-label="Toggle all Todo selected"
          className={classNames(
            'todoapp__toggle-all',
            { active: todos.every(item => item.completed) },
          )}
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={disableInput}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
