import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';


interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  deletedTodosID: number | null;
  completedTodosID: number[] | null;
  updatingTodosID: number[] | null
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, data: string | boolean) => void,
}

export const TodoList: FC<Props> = (
  {
    todos,
    tempTodo,
    deletedTodosID,
    completedTodosID,
    updatingTodosID,
    deleteTodo,
    updateTodo,
  },
) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          completedTodosID={completedTodosID}
          deletedTodosID={deletedTodosID}
          updatingTodosID={updatingTodosID}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          completedTodosID={completedTodosID}
          deletedTodosID={deletedTodosID}
          updatingTodosID={updatingTodosID}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
        />
      )}
    </section>
  );
};
