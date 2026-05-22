import { TodoItem } from '../../types/Todo';
import { Todo } from '../Todo/Todo';

type Props = {
  visibleTodos: TodoItem[];
  todos: TodoItem[];
  setTodos: (todos: TodoItem[]) => void;
  setErrorMessage: (message: string) => void;
  onDeleteTodo: (id: number) => void;
  onUpdateTodo: (todoId: number, data: Partial<TodoItem>) => void;
  tempTodo: TodoItem | null;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Todolist: React.FC<Props> = ({
  visibleTodos,
  setErrorMessage,
  onDeleteTodo,
  onUpdateTodo,
  tempTodo,
  inputRef,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          setErrorMessage={setErrorMessage}
          onUpdateTodo={onUpdateTodo}
          onDeleteTodo={onDeleteTodo}
          inputRef={inputRef}
        />
      ))}
      {tempTodo && (
        <Todo
          todo={tempTodo}
          setErrorMessage={() => {}}
          onDeleteTodo={() => {}}
          onUpdateTodo={() => {}}
          inputRef={inputRef}
        />
      )}
    </section>
  );
};
