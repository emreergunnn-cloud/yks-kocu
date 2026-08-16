export function getMonthGrid(
  year: number,
  month: number
): Array<Date | null> {
  const first =
    new Date(
      year,
      month,
      1
    );

  const result:
    Array<Date | null> =
      [];

  const offset =
    (first.getDay() + 6) %
    7;

  for (
    let index = 0;
    index < offset;
    index++
  ) {
    result.push(null);
  }

  const cursor =
    new Date(first);

  while (
    cursor.getMonth() ===
    month
  ) {
    result.push(
      new Date(cursor)
    );

    cursor.setDate(
      cursor.getDate() + 1
    );
  }

  while (
    result.length % 7 !==
    0
  ) {
    result.push(null);
  }

  return result;
}