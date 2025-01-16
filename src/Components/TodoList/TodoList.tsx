import React from 'react';
import { TodoInfo } from '..//Todo/TodoInfo';
import { Todo } from '../../Types/Todo';

interface TodoListProps {
  filteredTodos: Todo[];
  toggleTodos: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  toggleTodos,
  setTodos,
  setError,
}) => {
  return (
    <div>
      {filteredTodos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          toggleTodos={toggleTodos}
          setTodos={setTodos}
          setError={setError}
        />
      ))}
    </div>
  );
};

export default TodoList;
