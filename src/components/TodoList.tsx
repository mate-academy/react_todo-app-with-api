import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (id: number) => void,
  deleteTodoId: number,
  onToggleTodoStatus: (todoId: number) => void,
  onUpdateTodoTitle: (id: number, newTitle: string) => void;
  allTodosCompleted: boolean;
  setAllTodosCompleted: (completed: boolean) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodo,
  deleteTodoId,
  onToggleTodoStatus,
  onUpdateTodoTitle,
  allTodosCompleted,
  setAllTodosCompleted,
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
                onToggleTodoStatus={onToggleTodoStatus}
                onUpdateTodoTitle={onUpdateTodoTitle}
                allTodosCompleted={allTodosCompleted}
                setAllTodosCompleted={setAllTodosCompleted}
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
              onToggleTodoStatus={onToggleTodoStatus}
              onUpdateTodoTitle={onUpdateTodoTitle}
              allTodosCompleted={allTodosCompleted}
              setAllTodosCompleted={setAllTodosCompleted}
            />
          </li>
        )}
      </ul>
    </section>
  );
};
