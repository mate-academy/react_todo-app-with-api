import React, { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  isAdding: boolean;
  onDeleteItem: (id: number) => void;
  onToggleTodo: (id: number, completed: boolean) => void;
  currentTitle: string;
  onRenameTodo: (todo: Todo, newTitle: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  onDeleteItem,
  onToggleTodo,
  currentTitle,
  onRenameTodo,
}) => {
  const user = useContext(AuthContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <ul className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <li key={todo.id}>
            <TodoItem
              todo={todo}
              isAdding={todo.isLoading}
              onDeleteItem={onDeleteItem}
              onToggleTodo={onToggleTodo}
              onRenameTodo={onRenameTodo}
            />
          </li>
        ))}

        {isAdding && user && (
          <li>
            <TodoItem
              key={0}
              todo={{
                id: 0,
                title: currentTitle,
                completed: false,
                userId: user.id,
                isLoading: true,
              }}
              isAdding
              onDeleteItem={onDeleteItem}
              onToggleTodo={onToggleTodo}
              onRenameTodo={onRenameTodo}
            />
          </li>
        )}
      </ul>
    </section>
  );
};
