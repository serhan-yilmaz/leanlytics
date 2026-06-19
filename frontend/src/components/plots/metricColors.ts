export function getMetricColors(
  isDark: boolean,
) {
  return isDark
    ? {
        weight: '#a2e6ff',
        bf: '#ffc582',
        lean: '#acffec',
        lean15: '#ffb6fa',
      }
    : {
        weight: '#7bcdf6',
        bf: '#ffb074',
        lean: '#6be8cf',
        lean15: '#e892df',
      }
}