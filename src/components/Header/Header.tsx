import React, {
  useContext, useState, useRef, useMemo, useCallback,
} from 'react';
import {
  TodoContext, TodoUpdateContext,
} from '../TodoContext';
import { AllCheckButton } from './AllCheckButton';

export const Header: React.FC = React.memo(() => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const {
    todos,
    user,
  } = useContext(TodoContext);
  const {
    sendNewTodo,
    showError,
  } = useContext(TodoUpdateContext);
  const isShow = useMemo(() => todos.length !== 0, [todos]);
  const isActive = useMemo(() => todos.every(todo => todo.completed), [todos]);

  // handle submit action of main input (where user typed new title for new todo)
  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      setIsAdding(() => true);
      event.preventDefault();

      if (title.trim()) {
        const temporaryTodo = {
          id: 0,
          userId: user?.id,
          title,
          completed: false,
        };

        await sendNewTodo(temporaryTodo);
      } else {
        showError('Title can\'t be empty or consist of only spaces');
      }

      setTitle('');
      setIsAdding(false);
      newTodoField?.current?.blur();
    }, [title],
  );

  // handle input action of main input (where user type new title for new todo)
  const handleNewInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => (
      setTitle(() => event.target.value)
    ), [],
  );

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
