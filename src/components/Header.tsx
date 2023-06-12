/* eslint-disable jsx-a11y/control-has-associated-label */
import { FormEvent, useState } from 'react';
import { Todo } from '../types/Todo';
import { addTodo, updateTodo } from '../api/todos';

interface HeaderProps {
  todos: Todo[],
  userId: number,
  handleTempTodo: (todo: Todo | null) => void,
  handleError: (error: string) => void;
  handleIsUpdating: (status: boolean) => void,
  handleUpdatingIds: (ids: number[]) => void,
}

export const Header = ({
  todos, userId, handleError, handleTempTodo,
  handleIsUpdating, handleUpdatingIds,
}:HeaderProps) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const hasTodos = todos.length > 0;

  const handleCleaner = () => {
    setIsDisabled(false);
    setTodoTitle('');
    handleIsUpdating(true);
  };

  const handleUpdateAllCompleted = () => {
    handleIsUpdating(true);
    let isAllCompleted = true;
    const AllIds = todos.map(todo => {
      if (!todo.completed) {
        isAllCompleted = false;
      }

      return todo.id;
    });

    handleUpdatingIds(AllIds);
    const updatedTodo = {
      completed: !isAllCompleted,
    };

    AllIds.forEach(id => {
      updateTodo(id, updatedTodo)
        .then(() => handleCleaner())
        .catch(() => handleError('Unable to update a todo'));
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!todoTitle.length) {
      handleError('Title can\'t be empty');

      return;
    }

    setIsDisabled(true);
    const newTodo: Todo = {
      id: 0,
      userId,
      title: todoTitle,
      completed: false,
    };

    handleTempTodo(newTodo);
    addTodo(newTodo, userId)
      .then(handleCleaner)
      .catch(() => handleError('Unable to add a todo'));
  };

  const handleTodoTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          onClick={() => handleUpdateAllCompleted()}
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
