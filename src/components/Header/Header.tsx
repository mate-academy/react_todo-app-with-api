import React, { useContext } from 'react';
import {
  TodoContext, TodoUpdateContext,
} from '../ContextProviders/TodoProvider';
import { AllCheckButton } from './AllCheckButton';

export const Header: React.FC = React.memo(() => {
  const {
    todos,
    newTodo,
    newTodoField,
    isAdding,
  } = useContext(TodoContext);
  const {
    handleNewSubmit,
    handleNewInput,
  } = useContext(TodoUpdateContext);
  const isShow = todos.length !== 0;
  const title = newTodo?.title || '';
  const isActive = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {isShow && <AllCheckButton isActive={isActive} />}

      <form onSubmit={handleNewSubmit}>
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
