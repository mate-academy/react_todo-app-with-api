type Props = {
  handleToggle: () => void;
};

export const TodoToggleAll: React.FC<Props> = ({ handleToggle }) => {
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        id="toggle-all"
        className="todoapp__toggle-all active"
        onClick={handleToggle}
      />
    </>
  );
};
