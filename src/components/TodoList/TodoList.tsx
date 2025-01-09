import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type TodoListProps = {
  onDeleteTodo: (id: number) => void;
  todos: Todo[];
  isLoadingChange: boolean;
  deleteTodoId: number | null;
  cleanCompleted: boolean;
  tempTodo: Todo | null;
  onUpdateTodo: (id: number) => void;
  isUpdating: number[] | null;
  setIsUpdating: React.Dispatch<React.SetStateAction<number[] | null>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setDeleteTodoId: React.Dispatch<React.SetStateAction<number | null>>;
};

export function TodoList({
  onDeleteTodo,
  todos,
  isLoadingChange,
  deleteTodoId,
  cleanCompleted,
  tempTodo,
  onUpdateTodo,
  isUpdating,
  setIsUpdating,
  setErrorMessage,
  setTodos,
  setDeleteTodoId,
}: TodoListProps) {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isLoadingChange={isLoadingChange}
          deleteTodoId={deleteTodoId}
          key={todo.id}
          cleanCompleted={cleanCompleted}
          onUpdateTodo={onUpdateTodo}
          isUpdating={isUpdating}
          setIsUpdating={setIsUpdating}
          setErrorMessage={setErrorMessage}
          setTodos={setTodos}
          setDeleteTodoId={setDeleteTodoId}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          isLoadingChange={isLoadingChange}
          deleteTodoId={deleteTodoId}
          key={tempTodo.id}
          cleanCompleted={cleanCompleted}
          onUpdateTodo={onUpdateTodo}
          isAdding={TodoItem !== null}
          setIsUpdating={setIsUpdating}
          setErrorMessage={setErrorMessage}
          setTodos={setTodos}
          setDeleteTodoId={setDeleteTodoId}
        />
      )}
    </section>
  );
}
