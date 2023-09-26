import React, {
  FormEvent, useContext, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { TodoContext } from '../context/todo.context';

const TodoListHeader:React.FC = () => {
  const {
    todosStatistics,
    addNewTodo, loadingTodo,
    toggleAllTodosStatus,
  } = useContext(TodoContext);
  const [inputTitle, setInputTitle] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todosStatistics]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (inputTitle.trim()) {
      addNewTodo(inputTitle);
      setInputTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      {
        todosStatistics.totalTodos > 0 && (
          // eslint-disable-next-line jsx-a11y/control-has-associated-label
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: todosStatistics.activeTodos,
            })}
            onClick={toggleAllTodosStatus}
          />
        )
      }

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputTitle}
          onChange={event => setInputTitle(event.target.value)}
          disabled={!!loadingTodo}
        />
      </form>
    </header>
  );
};

export default TodoListHeader;
