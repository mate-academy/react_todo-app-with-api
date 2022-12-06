import { FC } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoComponent } from './TodoComponent';

type Props = {
  visibleTodos: Todo[],
  isNewTodoLoaded: boolean,
  setVisibleTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setClickedIndex: React.Dispatch<React.SetStateAction<number>>,
  clickedIndex: number,
  isCompletedTodosDeleting: boolean,
  areTodosToggling: boolean,
};

export const TodoList: FC<Props> = ({
  isNewTodoLoaded,
  visibleTodos,
  setVisibleTodos,
  clickedIndex,
  setClickedIndex,
  isCompletedTodosDeleting,
  areTodosToggling,
}) => {
  // const user = useContext(AuthContext);
  // const [isTodoDeleted, setIsTodoDeleted] = useState(true);
  // const [isTodoToggled, setIsTodoToggled] = useState(false);
  // const [isTodoEdited, setIsTodoEdited] = useState(true);
  // const [isTodoEditing, setIsTodoEditing] = useState(false);

  // const {
  //   setIsRemoveErrorShown,
  //   setHasLoadingError,
  //   setIsEmptyTitleErrorShown,
  //   setIsTogglingErrorShown,
  //   setIsAddingErrorShown,
  // } = useContext(ErrorContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup
        className="item"
      >
        {visibleTodos.map((todo: Todo, index) => {
          const isCurrentClicked = index === clickedIndex;

          return (
            <CSSTransition
              key={todo.id}
              classNames="temp-item"
              timeout={300}
            >
              <TodoComponent
                isCurrentClicked={isCurrentClicked}
                isNewTodoLoaded={isNewTodoLoaded}
                visibleTodos={visibleTodos}
                setVisibleTodos={setVisibleTodos}
                clickedIndex={clickedIndex}
                setClickedIndex={setClickedIndex}
                isCompletedTodosDeleting={isCompletedTodosDeleting}
                areTodosToggling={areTodosToggling}
                todo={todo}
                index={index}
              />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </section>
  );
};
