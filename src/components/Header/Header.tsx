import { useState } from 'react';
import cn from 'classnames';

type Props = {
  setError: (error:string) => void;
  addNewTodo: (newTitle:string) => void;
  loadingTodoIds: number[];
  areAllTodosCompleted:boolean;
  hasCompletedTodos: boolean,
  checkAlltodos: () => void;
};

export const Header:React.FC<Props> = ({
  setError,
  addNewTodo,
  loadingTodoIds,
  areAllTodosCompleted,
  checkAlltodos,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const isLoading = loadingTodoIds.length > 0;

  const handleCheckAllTodos = () => checkAlltodos();
  const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newTodoTitle.length === 0) {
      setError('Title can\'t be empty');
    }

    addNewTodo(newTodoTitle);
    setNewTodoTitle('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {/*  eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: areAllTodosCompleted,
        })}
        onClick={handleCheckAllTodos}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
