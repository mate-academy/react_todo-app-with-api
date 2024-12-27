import { FC, useMemo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './TodoList.scss';

import { Todo, StatusFilter } from '../../types';
import { filterTodos } from '../../utils';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  todosAmount: number;
  loadingTodoIds: number[];
  tempTodo: Todo | null;
  editingTodo: Todo | null;
  setEditingTodo: (todo: Todo | null) => void;
  statusFilter: StatusFilter;
  onDeleteTodo: (todoId: Todo['id']) => void;
  onToggleTodo: (
    todoId: Todo['id'],
    isTodoCompleted: Todo['completed'],
  ) => void;
  onRenameTodo: (todo: Todo, newTitle: string) => void;
}

export const TodoList: FC<Props> = ({
  todos,
  todosAmount,
  loadingTodoIds,
  tempTodo,
  editingTodo,
  setEditingTodo,
  statusFilter,
  onDeleteTodo,
  onToggleTodo,
  onRenameTodo,
}) => {
  const visibleTodos = useMemo(
    () => filterTodos(todos, statusFilter),
    [todos, statusFilter],
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {!!todosAmount &&
          visibleTodos.map(todo => (
            <CSSTransition key={todo.id} timeout={300} classNames="item" appear>
              <TodoItem
                todo={todo}
                editingTodo={editingTodo}
                setEditingTodo={setEditingTodo}
                loadingTodoIds={loadingTodoIds}
                onDeleteTodo={onDeleteTodo}
                onToggleTodo={onToggleTodo}
                onRenameTodo={onRenameTodo}
              />
            </CSSTransition>
          ))}

        {tempTodo && (
          <CSSTransition
            key={tempTodo.id}
            timeout={300}
            classNames="temp-item"
            appear
          >
            <TodoItem todo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
