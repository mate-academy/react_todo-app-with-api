import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ErrorType } from '../../types/ErrorType';
import { Todo } from '../../types/Todo';
import { TempTodo } from './TempTodo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => Promise<void>;
  loadTodos: () => Promise<void>;
  onUpdateTodoStatus: (todoId: number, status: boolean) => Promise<void>;
  processingIds: number[];
  isAdding: boolean;
  newTodoTitle: string;
  onChangeError: (errorType: ErrorType) => void;
  onChangeProcessingIds: (todoId: number) => void;
};

export const TodosList: React.FC<Props> = React.memo(({
  todos,
  onDeleteTodo,
  loadTodos,
  onUpdateTodoStatus,
  processingIds,
  isAdding,
  newTodoTitle,
  onChangeError,
  onChangeProcessingIds,
}) => (
  <TransitionGroup>
    {todos.map(todo => (
      <CSSTransition
        key={todo.id}
        timeout={300}
        classNames="item"
      >
        <TodoItem
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          loadTodos={loadTodos}
          onUpdateTodoStatus={onUpdateTodoStatus}
          isProcessed={processingIds.includes(todo.id)}
          onChangeError={onChangeError}
          onChangeProcessingIds={onChangeProcessingIds}
        />
      </CSSTransition>
    ))}

    {isAdding && (
      <CSSTransition
        key={0}
        timeout={300}
        classNames="temp-item"
      >
        <TempTodo title={newTodoTitle} />
      </CSSTransition>
    )}
  </TransitionGroup>
));
