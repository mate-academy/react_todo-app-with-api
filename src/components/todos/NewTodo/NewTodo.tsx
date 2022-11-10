import classNames from 'classnames';
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { Todo } from '../../../types/Todo';

interface Props {
  addTodo: (value: string) => void;
  isAdding: boolean;
  todos: Todo[];
  setLoadingTodos: (removedId: number[]) => void;
  toggleTodoStatus: (id: number, completed: boolean) => void;
}

export const NewTodo: React.FC<Props> = ({
  addTodo,
  isAdding,
  todos,
  setLoadingTodos,
  toggleTodoStatus,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();

    if (newTodoField.current) {
      addTodo(newTodoField.current.value);
      newTodoField.current.value = '';
    }
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const isToggleAllAcive = () => {
    return todos.length === todos.filter(todo => todo.completed).length;
  };

  const toggleAll = () => {
    if (isToggleAllAcive()) {
      setLoadingTodos(todos.map(todo => {
        toggleTodoStatus(todo.id, todo.completed);

        return todo.id;
      }));
    } else {
      setLoadingTodos(todos.filter(todo => !todo.completed)
        .map(todo => {
          toggleTodoStatus(todo.id, todo.completed);

          return todo.id;
        }));
    }
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="toggleAll"
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isToggleAllAcive() },
        )}
        onClick={() => toggleAll()}
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
