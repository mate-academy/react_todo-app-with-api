type ClearCompletedBtnProps = {
  hasCompleted: boolean;
  onClearCompleted: () => Promise<void>;
};

export const ClearCompletedBtn = ({
  hasCompleted,
  onClearCompleted,
}: ClearCompletedBtnProps) => {
  return (
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!hasCompleted}
      onClick={() => onClearCompleted()}
    >
      Clear completed
    </button>
  );
};
