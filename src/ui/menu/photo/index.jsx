import styles from "./index.module.scss";

const srcFallback = "/user.png";
const ICON_DIMENSION = 24;

/**
 * @function fallbackImageOnError
 * @param {React.SyntheticEvent<HTMLImageElement,Event>} event
 */
function fallbackImageOnError(event) {
  event.currentTarget.src = srcFallback;
}

/**
 * @function
 * @param {Object} props
 * @param {React.ImgHTMLAttributes<HTMLImageElement>["src"]} props.src
 * @returns {React.ReactNode}
 */
export default function MenuPhoto({ src = srcFallback }) {
  return (
    <img
      src={src}
      width={ICON_DIMENSION}
      height={ICON_DIMENSION}
      alt="photo"
      draggable="false"
      onError={fallbackImageOnError}
      className={styles.photo}
    />
  );
}
