export const Loader = () => {
  return (
    <div data-cy="TodoLoader" className="modal overlay">
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
