import React from 'react';
import { TodoItem } from '../components/TodoItem';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filter: FilterType;
  onDelete: (todoId: number) => void;
  onUpdate: (updatedTodo: Todo) => Promise<Todo>;
  onToggleCompletion: (todoId: number) => void;
  onToggleAll: () => void;
}

enum FilterT {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const TodoList: React.FC<TodoListProps> = ({ todos, tempTodo, filter, onDelete, onUpdate, onToggleCompletion }) => {

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case FilterT.Active:
        return !todo.completed;
      case FilterT.Completed:
        return todo.completed;
      case FilterT.All:
      default:
        return true;
    }
  });

  const todosToRender = tempTodo ? [...filteredTodos, tempTodo] : filteredTodos;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosToRender.map(todo => (
        <TodoItem
          key={todo.id ? todo.id : 'temp'}
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onToggleCompletion={onToggleCompletion}
        />
      ))}
    </section>
  );
}
