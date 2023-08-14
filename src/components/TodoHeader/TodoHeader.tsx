import { useState } from 'react';
import cn from 'classnames';
import { getCompletedTodos } from '../../services/todo';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  todos: Todo[],
  setErrorMessage: (message: ErrorMessage) => void
  createTodo: (todoTitle: string) => void,
  updateTodo: (changedTodo: Todo) => void,

};

export const TodoHeader: React.FC<Props> = ({
  todos,
  setErrorMessage,
  createTodo,
  updateTodo,
}) => {
  const [title, setTitle] = useState<string>('');
  const isAllCompleted = getCompletedTodos(todos).length === todos.length;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimedTitle = title.trim();

    if (!trimedTitle) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    createTodo(trimedTitle);
    setTitle('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => (
    setTitle(event.target.value)
  );

  const handleCheckAll = () => {
    if (!isAllCompleted) {
      todos.forEach(todo => {
        if (!todo.completed) {
          updateTodo({ ...todo, completed: true });
        }
      });
    } else {
      todos.forEach(todo => {
        updateTodo({ ...todo, completed: false });
      });
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn(
          'todoapp__toggle-all',
          { active: isAllCompleted },
        )}
        onClick={handleCheckAll}
      >
        ❯
      </button>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};
