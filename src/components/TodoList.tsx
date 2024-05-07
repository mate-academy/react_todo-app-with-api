import { TodoType, TodosArrayType } from '../types/Todo';

import Todo from './Todo';

type Props = {
  displayTodos: TodosArrayType;
  tempTodo: null | TodoType;
  deleteTodo: (todoId: number) => Promise<boolean>;
  markTodo(todoId: number, newStatus: boolean): Promise<boolean>;
  renameTodo(todoId: number, newTitle: string): Promise<boolean>;
};

export default function TodoList({
  displayTodos,
  tempTodo,
  deleteTodo,
  markTodo,
  renameTodo,
}: Props) {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {displayTodos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          markTodo={markTodo}
          renameTodo={renameTodo}
        />
      ))}
      {tempTodo && (
        <Todo
          todo={tempTodo}
          isTemp
          deleteTodo={deleteTodo}
          markTodo={markTodo}
          renameTodo={renameTodo}
        />
      )}
    </section>
  );
}
