import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/error';

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  todos: Todo[]
  addTodo: (newTodo: Omit<Todo, 'id'>) => void
  setErrorMessage: (message: ErrorType) => void
  handleAllCompleted: () => void
};

const USER_ID = 11299;

export const Header:React.FC<Props> = ({
  todos,
  addTodo,
  setErrorMessage,
  handleAllCompleted,
}) => {
  const [newTitle, setNewTitle] = useState('');

  const handlerInputTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewTitle('');
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (newTitle.trim()) {
        addTodo({
          userId: USER_ID,
          title: newTitle,
          completed: false,
        });
        setNewTitle('');
      } else {
        setErrorMessage(ErrorType.Empty);
        setTimeout(() => {
          setErrorMessage(ErrorType.None);
        }, 3000);
      }
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          onClick={handleAllCompleted}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={handlerInputTitle}
          onKeyDown={handleEnter}
        />
      </form>
    </header>
  );
};

export default Header;
