import {
  memo,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  isLoading: boolean,
  setIsLoading: (state: boolean) => void,
  toggledAlltodos:boolean;
  onAddTodo: (newTitle: string) => void,
  updatingTodo: (todo: Todo) => void,
};

export const Header: React.FC<Props> = memo(({
  todos,
  isLoading,
  setIsLoading,
  onAddTodo,
  updatingTodo,
  toggledAlltodos,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isToggledAll, setIsToggledAll] = useState(false);

  const newTodoField = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onAddTodo(todoTitle);
    setTodoTitle('');
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos.length]);

  const onToggleAll = () => {
    setIsLoading(true);
    if (isToggledAll === false) {
      todos.forEach(todo => {
        if (!todo.completed) {
          updatingTodo({ ...todo, completed: !todo.completed });
        }
      });
      setIsToggledAll(true);
    } else {
      todos.forEach(todo => {
        updatingTodo({ ...todo, completed: !todo.completed });
      });
      setIsToggledAll(false);
    }

    setIsLoading(false);
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={toggledAlltodos
          ? ('todoapp__toggle-all active')
          : ('todoapp__toggle-all')}
        onClick={onToggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
});
