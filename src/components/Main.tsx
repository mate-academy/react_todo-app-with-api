import { Todo } from '../types/Todo';
import { ErroMessage } from '../utils/errorMessages';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todoItem: Todo, shouldFocus: boolean) => void;
  addEditedTodos: (editedTodo: Todo) => void;
  handleErrorMessages: (newErrorMessage: ErroMessage) => void;
  isLoading: number[];
  setIsLoading: React.Dispatch<React.SetStateAction<number[]>>;
};

export const Main: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  addEditedTodos,
  handleErrorMessages,
  isLoading,
  setIsLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            isLoading={isLoading}
            onDelete={onDelete}
            addEditedTodos={addEditedTodos}
            handleErrorMessages={handleErrorMessages}
            setIsLoading={setIsLoading}
          />
        );
      })}
      {tempTodo && (
        <TodoItem todo={tempTodo} onDelete={onDelete} isLoading={isLoading} />
      )}
    </section>
  );
};
