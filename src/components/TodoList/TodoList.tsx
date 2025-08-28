import { FC } from 'react';
import { Todo } from '../../types/Todo';
import TodoItem from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  onDeleteTodo?: (id: number) => void;
  tempTodo?: Todo | null;
  loadingIds?: number[];
  toggleOneTodo?: (todo: Todo) => void;
  editTodoTitle?: (todoId: number, title: string) => void;
};

export const TodoList: FC<Props> = ({
  todos,
  onDeleteTodo,
  loadingIds,
  toggleOneTodo,
  editTodoTitle,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isLoadingTodo = loadingIds?.includes(todo.id) ?? false;

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDeleteTodo={onDeleteTodo}
            isLoadingTodo={isLoadingTodo}
            toggleOneTodo={toggleOneTodo}
            editTodoTitle={editTodoTitle}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          isTodoTemp={true}
          isLoadingTodo={loadingIds?.includes(tempTodo.id) ?? false}
        />
      )}
    </section>
  );
};
