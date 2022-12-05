import { FC } from 'react';
import { Loader } from './Loader';

type Props = {
  isCurrentClicked: boolean,
  isNewTodoLoaded: boolean,
  isTodoToggled: boolean,
  isTodoDeleted: boolean,
  isTodoEdited: boolean,
  areTodosToggling: boolean,
  todoCompleted: boolean,
  isCompletedTodosDeleting: boolean,
};

export const Loaders: FC<Props> = ({
  isCurrentClicked,
  isNewTodoLoaded,
  isTodoToggled,
  isTodoDeleted,
  isTodoEdited,
  areTodosToggling,
  todoCompleted,
  isCompletedTodosDeleting,
}) => {
  return (
    <>
      {isCurrentClicked && (
        <>
          <Loader isActiveCondition={!isNewTodoLoaded} />
          <Loader isActiveCondition={isTodoToggled} />
          <Loader isActiveCondition={!isTodoDeleted} />
          <Loader isActiveCondition={!isTodoEdited} />
        </>
      )}

      <Loader
        isActiveCondition={areTodosToggling
          || (todoCompleted && isCompletedTodosDeleting)}
      />
    </>
  );
};
