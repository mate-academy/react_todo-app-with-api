import {
  FormEvent,
  useState,
  memo,
} from 'react';
import cn from 'classnames';
import { addTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

interface Props {
  onError: (errText: string) => void;
  onChange: (todo: Todo | null) => void;
  onUpdate: (todo: Todo) => void;
  onToggle: () => void;
  userId: number;
  todos: Todo[] | null;
}

export const Header: React.FC<Props> = memo(({
  userId,
  onError,
  onChange,
  onUpdate,
  onToggle,
  todos,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isToggleActive = todos?.every(todo => todo.completed === true);

  const handleAddTodo = async (event: FormEvent) => {
    event.preventDefault();

    if (!inputValue || inputValue.trim().length < 1) {
      onError('title cant be empty');
      setInputValue('');

      return;
    }

    setIsLoading(true);
    onChange({
      id: 0,
      userId: 10283,
      title: inputValue,
      completed: false,
    });

    try {
      await addTodo({
        title: inputValue.trim(),
        userId,
        completed: false,
      }).then(response => onUpdate(response as Todo));
    } catch {
      onError('can not add todo');
    }

    setIsLoading(false);
    setInputValue('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: isToggleActive,
        })}
        onClick={onToggle}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          disabled={isLoading}
          value={inputValue}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(event) => {
            setInputValue(event.target.value);
            onError('');
          }}
        />
      </form>
    </header>
  );
});
