import React, {
  useState,
  useEffect,
  useRef,
} from 'react';

type Props = {
  addNewTodo: (title: string) => void;
  isAdding: boolean;
  toggleTodosCompleted: () => void;
  allTodosCompleted: boolean;
};

export const TodoAppHeader: React.FC<Props> = React.memo(
  ({
    addNewTodo,
    isAdding,
    toggleTodosCompleted,
    allTodosCompleted,
  }) => {
    const [todoTitle, setTodoTitle] = useState('');
    const newTodoField = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (newTodoField.current) {
        newTodoField.current.focus();
      }
    }, [isAdding]);

    const handleNewTodoFieldSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      addNewTodo(todoTitle.trim());
      setTodoTitle('');
    };

    return (
      <header className="todoapp__header">
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={`todoapp__toggle-all ${allTodosCompleted && 'active'}`}
          onClick={toggleTodosCompleted}
        />

        <form onSubmit={handleNewTodoFieldSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            ref={newTodoField}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={todoTitle}
            onChange={event => setTodoTitle(event.target.value)}
            disabled={isAdding}
          />
        </form>
      </header>
    );
  },
);
