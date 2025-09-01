type Props = {
  styles?: string;
};
function Loader({ styles = '' }: Props) {
  return <div className={`loader ${styles}`} />;
}

export default Loader;
