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
  onAddTodo: (newTitle: string) => void,
  updatingTodo: (todo: Todo) => void,
};

export const Header: React.FC<Props> = memo(({
  todos,
  isLoading,
  setIsLoading,
  onAddTodo,
  updatingTodo,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

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

  const completedTodos = todos.filter(todo => todo.completed === true);
  const isNeedToChangeStaTus = completedTodos.length !== todos.length;

  const onToggleAll = () => {
    setIsLoading(true);
    todos.forEach(async (todo) => {
      if (todo.completed !== isNeedToChangeStaTus) {
        await updatingTodo({ ...todo, completed: isNeedToChangeStaTus });
      }
    });
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={isNeedToChangeStaTus
          ? ('todoapp__toggle-all')
          : ('todoapp__toggle-all active')}
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
