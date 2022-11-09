import React, { useContext, useState } from 'react';
import {
  TodoContext, TodoUpdateContext,
} from '../TodoContext';
import { AllCheckButton } from './AllCheckButton';

export const Header: React.FC = React.memo(() => {
  const [isAdding, setIsAdding] = useState(false);
  const {
    todos,
    newTodo,
    newTodoField,
  } = useContext(TodoContext);
  const {
    handleNewSubmit,
    handleNewInput,
  } = useContext(TodoUpdateContext);
  const isShow = todos.length !== 0;
  const title = newTodo?.title || '';
  const isActive = todos.every(todo => todo.completed);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setIsAdding(() => true);
    handleNewSubmit(event);
    setIsAdding(() => false);
  };

  return (
    <header className="todoapp__header">
      {isShow && <AllCheckButton isActive={isActive} />}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleNewInput}
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
