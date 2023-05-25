import { useState, memo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../todoItem/TodoItem';
import { TempTodo } from '../todoItem/TempTodo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  handleDeleteTodo: (id: number) => void;
  loading: boolean;
  loadingID: number;
  handleUpdateTodoIsCompleted: (
    id: number,
    complitedCurrVal: boolean,
  ) => void;
  editTodo: (newTitle: string, id: number) => void;
}
export const Main: React.FC<Props> = memo(({
  todos,
  tempTodo,
  handleDeleteTodo,
  loading,
  loadingID,
  handleUpdateTodoIsCompleted,
  editTodo,
}) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const handleSetEditingTodoId = (id: number | null) => {
    setEditingTodoId(id);
  };

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos
        && todos.map(({
          title,
          id,
          completed,
        }) => (
          <CSSTransition
            key={id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              loading={loading}
              loadingID={loadingID}
              key={id}
              title={title}
              id={id}
              completed={completed}
              onDelete={handleDeleteTodo}
              onIsComplitedUpdate={handleUpdateTodoIsCompleted}
              setEditingTodoId={handleSetEditingTodoId}
              editingTodoId={editingTodoId}
              editTodo={editTodo}
            />
          </CSSTransition>
        ))}
        {tempTodo
        && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TempTodo tempTodo={tempTodo} />
          </CSSTransition>
        )}

      </TransitionGroup>
    </section>
  );
});
