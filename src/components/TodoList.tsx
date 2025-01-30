import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import TodoItem from './TodoItem';
import { Todo } from '../types/Todo';

interface TodoListProps {
  filteredTodos: Todo[];
  loadingTodoId: number | null;
  deleteTodo: (id: number) => Promise<void | null>;
  toggleTodo: (todo: Todo) => void;
  updateTodoTitle: (todo: Todo, newTitle: string) => Promise<void>;
}

const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  loadingTodoId,
  deleteTodo,
  toggleTodo,
  updateTodoTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              loadingTodoId={loadingTodoId}
              deleteTodo={deleteTodo}
              toggleTodo={() => toggleTodo(todo)}
              updateTodoTitle={updateTodoTitle}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};

export default TodoList;
