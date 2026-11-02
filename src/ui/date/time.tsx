interface Props {
  dateTime: number;
}

export default function DateTime({ dateTime }: Props): React.ReactNode {
  const date = new Date(dateTime);

  return <time dateTime={date.toISOString()}>{date.toDateString()}</time>;
}
