/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { FormEvent, useState } from 'react';
import { useTodoContext } from '../hooks/useTodoContext';

const TodoHeader = () => {
  const {
    todos,
    USER_ID,
    tempTodo,
    onCreateTodo,
    onUpdateAllStatus,
  } = useTodoContext();
  const [newTodo, setNewTodo] = useState('');

  const handleCreateTodo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodo.trim()) {
      return;
    }

    const data = {
      title: newTodo,
      userId: USER_ID,
      completed: false,
    };

    await onCreateTodo(data);
    setNewTodo('');
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(t => t.completed),
          })}
          onClick={onUpdateAllStatus}
        />
      )}

      <form onSubmit={handleCreateTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          disabled={tempTodo !== null}
        />
      </form>
    </header>

  );
};

export default TodoHeader;
