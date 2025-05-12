import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type TodoListProps = {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodos: (todoIds: number[]) => Promise<void>;
  isLoading: boolean;
  processingTodoIds: number[];
  toggleTodos: (todos: Todo[]) => Promise<boolean[]>;
  updateTodos: (todosToUpdate: Todo[]) => Promise<boolean[]>;
  focusInput: () => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  deleteTodos,
  isLoading,
  processingTodoIds,
  toggleTodos,
  updateTodos,
  focusInput,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              deleteTodos={deleteTodos}
              isLoading={false}
              processingTodoIds={processingTodoIds}
              toggleTodos={toggleTodos}
              updateTodos={updateTodos}
              focusInput={focusInput}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              deleteTodos={deleteTodos}
              isLoading={isLoading}
              processingTodoIds={processingTodoIds}
              toggleTodos={toggleTodos}
              updateTodos={updateTodos}
              focusInput={focusInput}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
