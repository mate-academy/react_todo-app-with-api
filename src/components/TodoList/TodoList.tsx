import { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>,
  todos: Todo[],
  deleteTodo: (todoId: number) => void,
  tempTodo: Todo | null,
  isNewTodoLoading: boolean,
  toggleTodoStatus: (todoId: number, checked: boolean) => void,
  updatingTodos: number[],
  updateTodoTitle: (
    todoId: number,
    newTitle: string,
  ) => void,
}

export const TodoList: React.FC<Props> = memo(({
  newTodoField,
  todos,
  deleteTodo,
  tempTodo,
  isNewTodoLoading,
  toggleTodoStatus,
  updatingTodos,
  updateTodoTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          newTodoField={newTodoField}
          todo={todo}
          deleteTodo={deleteTodo}
          key={todo.id}
          toggleTodoStatus={toggleTodoStatus}
          isUpdating={updatingTodos.includes(todo.id)}
          updateTodoTitle={updateTodoTitle}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          newTodoField={newTodoField}
          todo={tempTodo}
          deleteTodo={deleteTodo}
          key={tempTodo?.id}
          isNewTodoLoading={isNewTodoLoading}
          toggleTodoStatus={toggleTodoStatus}
          updateTodoTitle={updateTodoTitle}
        />
      )}
    </section>
  );
});
