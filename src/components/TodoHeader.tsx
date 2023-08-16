import React, { useCallback, useState } from 'react';
import cn from 'classnames';
import { Error } from '../utils/collection';
import { Todo } from '../types/Todo';
import { USER_ID, createTodo } from '../api/todos';

type Props = {
  activeButton: boolean,
  setNewTodo: (todo: Todo | null) => void,
  setCurrentError: (value: Error) => void,
  setTodos: (array: Todo[]) => void,
  todos: Todo[],
  updateAllCompleted: (todo: Todo) => void
};

export const TodoHeader: React.FC<Props> = ({
  activeButton,
  setNewTodo,
  setCurrentError,
  setTodos,
  todos,
  updateAllCompleted,
}) => {
  const [title, setTitle] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  const handleTodoAdd = useCallback((task: string) => {
    const newTask: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: task,
      completed: false,
    };

    setNewTodo({ ...newTask, id: 0 });

    createTodo(newTask)
      .then(actualTodo => {
        setTodos([...todos, actualTodo]);
        setIsAdded(false);
        setTitle('');
      })
      .catch(() => {
        setCurrentError(Error.ADD);
        setIsAdded(false);
      })
      .finally(() => setNewTodo(null));
  }, [todos]);

  const handleEnter = useCallback((
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setIsAdded(true);

      if (!title.trim()) {
        setIsAdded(false);
        setCurrentError(Error.TITLE);
      } else {
        handleTodoAdd(title.trim());
      }
    }
  }, [title]);

  const handleButton = useCallback(() => {
    const activeTodo = [...todos].filter(todo => !todo.completed);

    if (activeTodo.length) {
      activeTodo.forEach(todo => (updateAllCompleted({
        ...todo,
        completed: !todo.completed,
      })));
    } else {
      [...todos].forEach(todo => (updateAllCompleted({
        ...todo,
        completed: !todo.completed,
      })));
    }
  }, [todos]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        aria-label="active"
        className={cn('todoapp__toggle-all', { active: activeButton })}
        onClick={handleButton}
      />

      <form>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={handleEnter}
          disabled={isAdded}
        />
      </form>
    </header>
  );
};
