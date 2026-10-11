// Shared formatting without framework or server dependencies.
export const formatNumberWithCommas = (number: number) =>
  number.toLocaleString("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const isDataUrl = (value: string) => value.startsWith("data:");

export const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};
