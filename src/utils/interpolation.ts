export const interpolate = (
  template: string,
  variables: Record<string, string | number>,
): string => {
  let text = template;

  Object.entries(variables).forEach(([param, value]) => {
    text = text.replace(`{${param}}`, String(value)) as typeof text;
  });

  return text;
};
