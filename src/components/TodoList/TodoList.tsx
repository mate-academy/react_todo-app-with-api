import React from 'react';
import { Todo } from '../../types/Types';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  processings: number[];
  tempTodoTitle: string;
  onTodoRename: (todoId: number, newTodoTitle: string) => Promise<void>;
  onTodoToggle: (idToToggle: number, completed: boolean) => Promise<void>;
  onTodoRemove: (idToRemove: number) => Promise<void>;
};

const tempTodo: Todo = {
  id: 0,
  title: '',
  completed: false,
  userId: 0,
};

export const TodoList: React.FC<Props> = ({
  todos,
  processings,
  tempTodoTitle,
  onTodoRename,
  onTodoToggle,
  onTodoRemove,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            onRename={(newtitle: string) => onTodoRename(todo.id, newtitle)}
            onToggle={() => onTodoToggle(todo.id, todo.completed)}
            onRemove={() => onTodoRemove(todo.id)}
            isProcessing={processings.includes(todo.id)}
          />
        );
      })}
      {tempTodoTitle && (
        <TodoItem
          key={0}
          todo={{ ...tempTodo, title: tempTodoTitle }}
          isProcessing={true}
        />
      )}
    </section>
  );
};
