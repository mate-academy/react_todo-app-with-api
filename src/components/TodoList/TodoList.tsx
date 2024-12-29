import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type TodoListProps = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  processingTodos: number[];
  onTodoDelete: (id: number) => Promise<void>;
  onEdit: (id: number, updatedFields: Partial<Todo>) => Promise<void>;
};

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  tempTodo,
  processingTodos,
  onTodoDelete,
  onEdit,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {filteredTodos.map(todo => (
        <CSSTransition key={todo.id} timeout={300} classNames="item">
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={onTodoDelete}
            processingTodos={processingTodos}
            onEdit={onEdit}
          />
        </CSSTransition>
      ))}

      {tempTodo && (
        <CSSTransition key={0} timeout={300} classNames="temp-item">
          <TodoItem todo={tempTodo} />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
