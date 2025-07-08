import { useTodosContext } from '../context/TodoContextProvider';
import { TodoItem } from './TodoItem';

export const ToDoList: React.FC = () => {
  const { filteredTodos, deleteTodoById, updatingTodoIds, tempTodo } =
    useTodosContext();

  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        {filteredTodos.map(todo => {
          const isProcessing =
            deleteTodoById.includes(todo.id) ||
            updatingTodoIds.includes(todo.id);

          return (
            <TodoItem key={todo.id} todo={todo} isProcessing={isProcessing} />
          );
        })}
      </section>

      {tempTodo && <TodoItem key={0} todo={tempTodo} isProcessing={true} />}
    </>
  );
};
