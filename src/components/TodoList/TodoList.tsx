import { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[],
  tempTodo: Todo | null,
  newTodoField: React.RefObject<HTMLInputElement>,
  deletingTodoIds: number[],

  deleteTodo: (todoId: number) => Promise<void>,
  changeTodoStatus: (todoId: number, status: boolean) => void,
  updateTodoFields: (
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>
  ) => Promise<void>,
  selectedTodoIds: number[],
}

export const TodoList: React.FC<Props> = memo(({
  todos,
  tempTodo,
  newTodoField,
  deletingTodoIds,
  deleteTodo,
  changeTodoStatus,
  updateTodoFields,
  selectedTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          isDeleting={deletingTodoIds.includes(todo.id)}
          changeTodoStatus={changeTodoStatus}
          updateTodo={updateTodoFields}
          newTodoField={newTodoField}
          selectedTodoIds={selectedTodoIds}
        />
      )))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          deleteTodo={deleteTodo}
          isDeleting={deletingTodoIds.includes(tempTodo.id)}
          changeTodoStatus={changeTodoStatus}
          updateTodo={updateTodoFields}
          newTodoField={newTodoField}
          selectedTodoIds={selectedTodoIds}
        />
      )}
    </section>
  );
});
