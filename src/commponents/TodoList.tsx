import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  deleteTodo: (postId: number) => void;
  handleCheckedId: (id: number) => void;
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  delitingTodos: number[];
  selectedId: number | null;
  updateTodo: (updatedTod: string, id: number) => void;
  handleUpdateTodo: (
    todoId: number,
    oldTitle: string,
    editingTitle: string,
  ) => Promise<boolean>;
  // setErrorMessage: () => void;
  // onEdit: (id: number, title: string) => void;
};

export const TodoList = ({
  visibleTodos,
  handleCheckedId,
  deleteTodo,
  delitingTodos,
  tempTodo,
  selectedId,
  updateTodo,
  handleUpdateTodo,
  // setErrorMessage,
  // onEdit,
}: Props) => {
  const finelTodos = tempTodo ? [...visibleTodos, tempTodo] : visibleTodos;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* {tempTodo && <TodoItem todo={tempTodo} />} */}

      {finelTodos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            handleCheckedId={handleCheckedId}
            deleteTodo={deleteTodo}
            selectedId={selectedId}
            updateTodo={updateTodo}
            handleUpdateTodo={handleUpdateTodo}
            delitingTodos={delitingTodos}
          />
        );
      })}
    </section>
  );
};

export default TodoList;
