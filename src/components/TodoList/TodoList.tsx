import { FC } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { getPreparedTodos } from '../../utils/getPreparedTodos';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';
import { TodoItem } from '../TodoItem/TodoItem';

interface TodoListProps {
  todos: Todo[];
  filter: FilterType;
  onDeleteTodo: (todoId: number) => Promise<void>;
  tempTodo: Todo | null;
  processingTodoIds: number[];
  onToggleStatusSingleTodo: (
    todoId: number,
    completed: boolean,
  ) => Promise<void>;
  onUpdateTodo: (todoId: number, title: string) => Promise<void>;
}

export const TodoList: FC<TodoListProps> = ({
  todos,
  filter,
  onDeleteTodo,
  tempTodo,
  processingTodoIds,
  onToggleStatusSingleTodo,
  onUpdateTodo,
}) => {
  const visibleTodos = getPreparedTodos(todos, filter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              key={todo.id}
              onDeleteTodo={onDeleteTodo}
              isLoading={processingTodoIds.includes(todo.id)}
              onToggleStatusSingleTodo={onToggleStatusSingleTodo}
              onUpdateTodo={onUpdateTodo}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              key="temp-todo"
              todo={tempTodo}
              onDeleteTodo={() => {}}
              isLoading={true}
              onToggleStatusSingleTodo={() => Promise.resolve()}
              onUpdateTodo={() => Promise.resolve()}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
