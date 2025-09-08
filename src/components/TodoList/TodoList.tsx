import * as React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type TodoListProps = {
  todos: Todo[];
  tempTodoId: number | null;
  selectedTodo: Todo | null;
  setSelectedTodo: (todo: Todo | null) => void;
  handleUpdateTodo: (id: number, data: Partial<Todo>) => void;
  handleDeleteTodo: (id: number) => void;
  handleEditTodo: (todo: Todo) => void;
  processingIds: number[];
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodoId,
  selectedTodo,
  setSelectedTodo,
  handleUpdateTodo,
  handleDeleteTodo,
  handleEditTodo,
  processingIds,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        tempTodoId={tempTodoId}
        selectedTodo={selectedTodo}
        onSelected={setSelectedTodo}
        onUpdate={handleUpdateTodo}
        onDelete={handleDeleteTodo}
        onEdit={handleEditTodo}
        processingIds={processingIds}
      />
    ))}
  </section>
);

export default TodoList;
