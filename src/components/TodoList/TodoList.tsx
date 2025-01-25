import { Todo } from '../../types/Todo';
import { UpdateReasons } from '../../types/UpdateReasons';
import { TodoItem } from '../TodoItem';

type Props = {
  filteredTodos: Todo[];
  isNewTodoAdding: boolean;
  loadingTodo: Todo | null;
  todoIdsForRemoving: number[] | null;
  isTodoDeleting: boolean;
  setIsTodoDeleting: (isTodoDeleting: boolean) => void;
  setTodoIdsForRemoving: (id: number[] | null) => void;
  idsForUpdate: number[];
  setReasonForUpdate: (reason: UpdateReasons | null) => void;
  setIdsForUpdate: (idsForUpdate: number[]) => void;
  setTypeOfStatusChange: (statusChanging: boolean | null) => void;
  setTitleForUpdate: (title: string) => void;
  titleSuccess: boolean | null;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  isNewTodoAdding,
  loadingTodo,
  todoIdsForRemoving,
  isTodoDeleting,
  setTodoIdsForRemoving,
  setIsTodoDeleting,
  idsForUpdate,
  setReasonForUpdate,
  setIdsForUpdate,
  setTypeOfStatusChange,
  setTitleForUpdate,
  titleSuccess,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isTodoDeleting={isTodoDeleting}
          setIsTodoDeleting={setIsTodoDeleting}
          todoIdsForRemoving={todoIdsForRemoving}
          setTodoIdsForRemoving={setTodoIdsForRemoving}
          idsForUpdate={idsForUpdate}
          setReasonForUpdate={setReasonForUpdate}
          setIdsForUpdate={setIdsForUpdate}
          setTypeOfStatusChange={setTypeOfStatusChange}
          setTitleForUpdate={setTitleForUpdate}
          titleSuccess={titleSuccess}
        />
      ))}

      {isNewTodoAdding && (
        <TodoItem
          key={loadingTodo!.id}
          todo={loadingTodo!}
          isNewTodoAdding={isNewTodoAdding}
          todoIdsForRemoving={todoIdsForRemoving}
          idsForUpdate={idsForUpdate}
          setIdsForUpdate={setIdsForUpdate}
          setReasonForUpdate={setReasonForUpdate}
          setTypeOfStatusChange={setTypeOfStatusChange}
          setTitleForUpdate={setTitleForUpdate}
          titleSuccess={titleSuccess}
        />
      )}
    </section>
  );
};
