import { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null,
  isDeleting: boolean,
  selectedTodoIds: number[],
  isTodoUpdating: boolean,
  newTodoField: React.RefObject<HTMLInputElement>,
  updateTodo: (todoId: number, newTodoData: Partial<Todo>) => Promise<void>,
  deleteTodo: (todoId: number) => Promise<void>,
};

export const TodoList: React.FC<Props> = memo((props) => {
  const {
    todos,
    tempTodo,
    isDeleting,
    selectedTodoIds,
    deleteTodo,
    isTodoUpdating,
    updateTodo,
    newTodoField,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          isDeleting={isDeleting}
          todoForDeleltingIds={selectedTodoIds}
          deleteTodo={deleteTodo}
          isUpdating={isTodoUpdating}
          newTodoField={newTodoField}
          updateTodo={updateTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          temporary
        />
      )}
    </section>
  );
});
