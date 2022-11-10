import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { addTodo } from '../../api/todos';
import { ErrorType } from '../../types/ErrorType';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  onChangeError: (errorType: ErrorType) => void;
  loadTodos: () => Promise<void>;
  isAdding: boolean;
  onChangeIsAdding: (status: boolean) => void;
  newTodoTitle: string;
  onChangeNewTodoTitle: (title: string) => void;
};

export const NewTodoField: React.FC<Props> = React.memo(({
  onChangeError,
  loadTodos,
  isAdding,
  onChangeIsAdding,
  newTodoTitle,
  onChangeNewTodoTitle,
}) => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  });

  const createNewTodo = useCallback(
    (title: string): Omit <Todo, 'id'> | null => {
      const titleWithoutSpacesAround = title.trim();
      let todoForServer = null;

      if (user && titleWithoutSpacesAround) {
        onChangeIsAdding(true);

        todoForServer = {
          userId: user.id,
          title: titleWithoutSpacesAround,
          completed: false,
        };
      }

      return todoForServer;
    }, [],
  );

  const handleAddTodo = useCallback(async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!newTodoTitle.trim().length) {
      onChangeError(ErrorType.EMPTYTITLE);
      onChangeNewTodoTitle('');

      return;
    }

    const newTodo = createNewTodo(newTodoTitle);

    try {
      await addTodo(newTodo);
    } catch {
      onChangeError(ErrorType.ADD);
    }

    await loadTodos();
    onChangeIsAdding(false);
    onChangeNewTodoTitle('');
  }, [newTodoTitle, user]);

  return (
    <form onSubmit={handleAddTodo}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        disabled={isAdding}
        value={newTodoTitle}
        placeholder="What needs to be done?"
        onFocus={() => onChangeError(ErrorType.NONE)}
        onChange={(event) => onChangeNewTodoTitle(event.target.value)}
      />
    </form>
  );
});
