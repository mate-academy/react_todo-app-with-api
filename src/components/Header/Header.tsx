/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';

interface Props {
  user: User | null
  title: string
  isAdding: boolean
  filteredTodos: Todo[]
  todos: Todo[]
  onTitleChange: (value: string) => void
  onError: (message: string) => void
  onAdd: (
    todo: Todo,
    todoField: React.RefObject<HTMLInputElement>
  ) => void
  onUpdate: (todo: Todo) => void
}

export const Header: React.FC<Props> = React.memo((
  {
    user,
    title,
    isAdding,
    todos,
    filteredTodos,
    onTitleChange,
    onError,
    onAdd,
    onUpdate,
  },
) => {
  const todoField = useRef<HTMLInputElement>(null);
  const [isActive, setIsActive] = useState<boolean>(
    todos.every(todo => todo.completed),
  );

  useEffect(() => {
    setIsActive(todos.every(todo => todo.completed));
  }, [isActive, todos]);

  useEffect(() => {
    if (todoField.current) {
      todoField.current.focus();
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      return;
    }

    if (!title.trim()) {
      onError('Title can\'t be empty');

      return;
    }

    const manualTodo = {
      id: 0,
      title,
      completed: false,
      userId: user?.id,
    };

    filteredTodos.push(manualTodo);

    onAdd(manualTodo, todoField);
  };

  const toggleAll = () => {
    if (!isActive) {
      todos.forEach(todo => onUpdate({ ...todo, completed: true }));
    } else {
      todos.forEach(todo => onUpdate({ ...todo, completed: false }));
    }
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={
          cn(
            'todoapp__toggle-all',
            { active: isActive },
          )
        }
        onClick={toggleAll}
      />

      <form onSubmit={(event) => handleSubmit(event)}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={todoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={isAdding}
          onChange={(event) => onTitleChange(event.target.value)}
        />
      </form>
    </header>
  );
});
