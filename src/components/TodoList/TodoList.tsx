import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface TodoListProps {
  todos: Todo[];
  isAdd: boolean;
  isChange: boolean;
  isDelete: boolean;
  tempId: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setIsDelete: (value: boolean) => void;
  setErrorMessage: (message: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  isAdd,
  isChange,
  isDelete,
  tempId,
  setTodos,
  setIsDelete,
  setErrorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          todos={todos}
          isAdd={isAdd}
          isChange={isChange}
          isDelete={isDelete}
          tempId={tempId}
          setTodos={setTodos}
          setIsDelete={setIsDelete}
          setErrorMessage={setErrorMessage}
        />
      ))}
    </section>
  );
};
