import { Todo } from '../types/Todo';
import { ErroMessage } from '../utils/errorMessages';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todoItem: Todo, shouldFocus: boolean) => void;
  addEditedTodo: (editedTodo: Todo) => void;
  handleErrorMessages: (newErrorMessage: ErroMessage) => void;
  isLoading: number[];
  setIsLoading: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  addEditedTodo,
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
            addEditedTodo={addEditedTodo}
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
