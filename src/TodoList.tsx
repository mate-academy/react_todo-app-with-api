/* eslint-disable no-lone-blocks */
import { Todo } from './types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  visibleTodos: Todo[];
  deleteTodo: (todoId: number) => void;
  deletingTodoId: number | null;
  tempTodo: Todo | null;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  toggleTodo: (todoId: number) => void
  updateTodoList: (updatedTodoItem: Todo) => void
  setErrorMessage: (newMessage: string) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  deleteTodo,
  deletingTodoId,
  isLoading,
  setIsLoading,
  tempTodo,
  toggleTodo,
  updateTodoList,
  setErrorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <ul>
        {visibleTodos.map((todo) => (
          <li key={todo.id}>
            <TodoItem
              todo={todo}
              deleteTodo={deleteTodo}
              isDeleting={deletingTodoId === todo.id && isLoading}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              toggleTodo={toggleTodo}
              updateTodoList={updateTodoList}
              setErrorMessage={setErrorMessage}
            />
          </li>
        ))}
        {tempTodo && (
          <li key={tempTodo.id}>
            <TodoItem
              todo={tempTodo}
              deleteTodo={deleteTodo}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              toggleTodo={toggleTodo}
              updateTodoList={updateTodoList}
              setErrorMessage={setErrorMessage}
            />
          </li>
        )}
      </ul>
    </section>
  );
};
