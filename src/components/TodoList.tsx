import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (id: number) => void,
  deleteTodoId: number,
  onToggleTodo: (todoId: number) => void,
  onUpdateTodoTitle: (id: number, newTitle: string) => void;
  isDisabled: boolean,
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodo,
  deleteTodoId,
  onToggleTodo,
  onUpdateTodoTitle,
  isDisabled,
}) => {
  return (
    <section className="todoapp__main">
      <ul className="todo-list">
        {todos.map((todo) => {
          return (
            <li key={todo.id}>
              <TodoItem
                todo={todo}
                onDelete={deleteTodo}
                deleteTodoId={deleteTodoId}
                onToggleTodo={onToggleTodo}
                onUpdateTodoTitle={onUpdateTodoTitle}
                isDisabled={isDisabled}
              />
            </li>
          );
        })}

        {tempTodo && (
          <li>
            <TodoItem
              todo={tempTodo}
              onDelete={deleteTodo}
              deleteTodoId={deleteTodoId}
              onToggleTodo={onToggleTodo}
              onUpdateTodoTitle={onUpdateTodoTitle}
              isDisabled={isDisabled}
            />
          </li>
        )}
      </ul>
    </section>
  );
};
