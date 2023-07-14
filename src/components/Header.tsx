import { FormEvent, useState } from 'react';
import { Todo } from '../types/Todo';
import { addTodo } from '../api/todos';

interface Props {
  todos: Todo[];
  userId: number;
  changeErrorText: (error: string) => void;
  addTempTodo: (todo: Todo | null) => void;
  handleIsUpdating: (status: boolean) => void;
  handleUpdatingIds: (ids: number[]) => void;
  updateCompletedTodos: () => void;
}

export const Header: React.FC<Props> = ({
  todos, userId, changeErrorText, addTempTodo,
  handleIsUpdating, updateCompletedTodos,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const hasTodos = todos.length > 0;

  const handleCleanUp = () => {
    setIsDisabled(false);
    setTodoTitle('');
    handleIsUpdating(true);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle.length) {
      changeErrorText('Title can\'t be empty');

      return;
    }

    setIsDisabled(true);
    const newTodo: Todo = {
      id: 0,
      userId,
      title: trimmedTitle,
      completed: false,
    };

    addTempTodo(newTodo);
    addTodo(newTodo, userId)
      .then(handleCleanUp)
      .catch(() => changeErrorText('Unable to add a todo'));
  };

  const handleTodoTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          aria-label="toggle-all"
          className="todoapp__toggle-all active"
          onClick={updateCompletedTodos}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleTodoTitle}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
