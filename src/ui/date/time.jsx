/**
 * @function
 * @param {Object} props
 * @param {number} props.dateTime
 * @returns {React.ReactNode}
 */
export default function DateTime({ dateTime }) {
  const date = new Date(dateTime);

  return <time dateTime={date.toISOString()}>{date.toDateString()}</time>;
}
