import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';
import { TodoCard } from '../TodoCard/TodoCard';
import { TodoCardTemplate } from '../TodoCard/TodoCardTemplate';

interface Props {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  isDeleting: boolean;
  setTodos: (todos: Todo[]) => void;
  setHasError: (hasError: Errors) => void;
  initialTodos: Todo[];
  isUpdating: boolean;
  setIsUpdating: (isUpdating: boolean) => void;
  updatingTodoId: number | null;
  setUpdatingTodoId: (updatingTodoId: number | null) => void;
  toggleCompleteAll: boolean;
  handleDelete: (todoId: number) => void;
  deletingCardId: number | null;
  handleComplete: (currentTodo: Todo) => void;
}
export const TodoList: React.FC<Props> = props => {
  const {
    filteredTodos,
    tempTodo,
    isDeleting,
    setTodos,
    setHasError,
    initialTodos,
    isUpdating,
    setIsUpdating,
    updatingTodoId,
    setUpdatingTodoId,
    toggleCompleteAll,
    handleDelete,
    deletingCardId,
    handleComplete,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        return (
          <TodoCard
            key={todo.id}
            CurrentTodo={todo}
            isDeleting={isDeleting}
            setTodos={setTodos}
            setHasError={setHasError}
            initialTodos={initialTodos}
            isUpdating={isUpdating}
            setIsUpdating={setIsUpdating}
            updatingTodoId={updatingTodoId}
            setUpdatingTodoId={setUpdatingTodoId}
            toggleCompleteAll={toggleCompleteAll}
            handleDelete={handleDelete}
            deletingCardId={deletingCardId}
            handleComplete={handleComplete}
          />
        );
      })}
      {tempTodo && <TodoCardTemplate title={tempTodo.title} />}
    </section>
  );
};
