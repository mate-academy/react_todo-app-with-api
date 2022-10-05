import { useContext } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  todos: Todo[];
  isAdding: boolean;
  query: string;
  onRemoveTodo: (todoId: number) => void;
  isLoadingList: number[];
  onUpdateStatus: (todo: Todo) => void;
  onSetEditTodoId: (todoId: number | null) => void;
  editTodoId: number | null;
  onSetNewTitle: (title: string) => void;
  newTitle: string;
  onUpdateTitle: (todo: Todo, cancel?: boolean) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  query,
  onRemoveTodo,
  isLoadingList,
  onUpdateStatus,
  onSetEditTodoId,
  editTodoId,
  onSetNewTitle,
  newTitle,
  onUpdateTitle,
}) => {
  const user = useContext(AuthContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              onRemoveTodo={onRemoveTodo}
              isProcessing={isLoadingList.includes(todo.id)}
              onUpdateStatus={onUpdateStatus}
              onSetEditTodoId={onSetEditTodoId}
              editTodoId={editTodoId}
              newTitle={newTitle}
              onSetNewTitle={onSetNewTitle}
              onUpdateTitle={onUpdateTitle}
            />
          </CSSTransition>

        ))}

        {isAdding
      && (
        <CSSTransition
          key={0}
          timeout={300}
          classNames="temp-item"
        >
          <TodoItem
            todo={{
              id: 0,
              title: query,
              completed: false,
              userId: user?.id || 0,
            }}
            onRemoveTodo={onRemoveTodo}
            onUpdateStatus={onUpdateStatus}
            onSetEditTodoId={onSetEditTodoId}
            editTodoId={editTodoId}
            newTitle={newTitle}
            onSetNewTitle={onSetNewTitle}
            onUpdateTitle={onUpdateTitle}
            isProcessing
          />
        </CSSTransition>

      )}
      </TransitionGroup>
    </section>
  );
};
