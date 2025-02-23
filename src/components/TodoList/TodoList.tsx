import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { UpdateTodoData } from '../../types/UpdateTodoData';
import { ErrorType } from '../../types/Errors';

type Props = {
  preparedTodos: Todo[];
  processingTodos: number[];
  tempTodo: Todo | null;
  removeTodo: (id: number) => void;
  toggleTodoStatus: (id: number, data: UpdateTodoData) => void;
  errorMessage: ErrorType | '';
  editingTodoId: number | null;
  selectedEditTodoId: (id: number | null) => void;
  onUpdateTodo: (id: number, data: UpdateTodoData) => Promise<void>;
  updateProcessingTodos: (id: number) => void;
  removeProcessingTodos: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  preparedTodos,
  processingTodos,
  tempTodo,
  removeTodo,
  toggleTodoStatus,
  onUpdateTodo,
  updateProcessingTodos,
  removeProcessingTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {preparedTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              isActive={processingTodos.includes(todo.id)}
              removeTodo={() => removeTodo(todo.id)}
              toggleTodoStatus={() =>
                toggleTodoStatus(todo.id, { completed: !todo.completed })
              }
              onUpdateTodo={onUpdateTodo}
              updateProcessingTodos={updateProcessingTodos}
              removeProcessingTodos={removeProcessingTodos}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} isActive={true} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
