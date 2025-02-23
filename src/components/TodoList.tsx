/* eslint-disable react/display-name */
import { memo } from 'react';
import { Todo, UpdateTodoData } from '../types/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoItem } from './TodoItem';
import { ErrorsTypes } from '../types/Error';

interface Props {
  visibleTodos: Todo[];
  processingsTodos: number[];
  tempTodo: Todo | null;
  removeTodo: (id: number) => void;
  toggleTodoStatus: (id: number, data: UpdateTodoData) => void;
  error: ErrorsTypes | '';
  editingTodoId: number | null;
  selectedEditTodoId: (id: number | null) => void;
  onUpdateTodo: (id: number, data: UpdateTodoData) => Promise<void>;
  updateProcessingsTodos: (id: number) => void;
  removeProcessingsTodos: (id: number) => void;
}

export const TodoList = memo((props: Props) => {
  const {
    visibleTodos,
    processingsTodos,
    removeTodo,
    tempTodo = null,
    toggleTodoStatus,
    onUpdateTodo,
    updateProcessingsTodos,
    removeProcessingsTodos,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              isActive={processingsTodos.includes(todo.id)}
              removeTodo={() => removeTodo(todo.id)}
              toggleTodoStatus={() =>
                toggleTodoStatus(todo.id, { completed: !todo.completed })
              }
              onUpdateTodo={onUpdateTodo}
              updateProcessingsTodos={updateProcessingsTodos}
              removeProcessingsTodos={removeProcessingsTodos}
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
});
