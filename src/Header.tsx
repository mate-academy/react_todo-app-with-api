import cn from 'classnames';
import { Todo } from './types/Todo';
import { useEffect, useRef } from 'react';
import { getTodos, patchTodo } from './api/todos';

type Props = {
  isLoading: number[];
  handleSubmit: (event: React.FormEvent) => void;
  setErrMessage: React.Dispatch<React.SetStateAction<string>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setNewTitle: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<number[]>>;
  newTitle: string;
  todos: Todo[];
};

export const Header = ({
  setErrMessage,
  setIsLoading,
  setTodos,
  isLoading,
  handleSubmit,
  newTitle,
  setNewTitle,
  todos,
}: Props) => {
  const isAllActive = todos.every(todo => todo.completed);

  const selectInputTitle = useRef<HTMLInputElement>(null);

  //focus on input for creating new title
  useEffect(() => {
    if (selectInputTitle.current) {
      selectInputTitle.current.focus();
    }
  }, [isLoading]);

  const handleChangeCompleted = async () => {
    const checkAll = todos.every(todo => todo.completed);

    try {
      for (const todo of todos) {
        if (todo.completed === !checkAll) {
          continue;
        }

        setIsLoading(prevState => [...prevState, todo.id]);

        await patchTodo({
          ...todo,
          completed: !checkAll,
        });
      }

      const updatedTodos = await getTodos();

      setTodos(updatedTodos);
    } catch {
      setErrMessage('Unable to update a todo');
    } finally {
      setIsLoading([]);
    }
  };

  return (
    <header className="todoapp__header">
      {isLoading.length === 0 && todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all ', { active: isAllActive })}
          data-cy="ToggleAllButton"
          onClick={handleChangeCompleted}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={selectInputTitle}
          value={newTitle}
          disabled={isLoading?.length !== 0}
          onChange={event => setNewTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
