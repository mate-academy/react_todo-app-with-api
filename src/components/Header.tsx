/* eslint-disable max-len */
export const Header: React.FC<{
  handleToggle: () => Promise<void>;
  areAllCompleted: boolean;
}> = ({
  handleToggle,
  areAllCompleted, // Add a prop to track completion status
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all ${areAllCompleted ? 'active' : ''}`} // Dynamically set the active class
        data-cy="ToggleAllButton"
        title="Toggle all todos"
        onClick={handleToggle}
      >
        Toggle All
      </button>
    </header>
  );
};
