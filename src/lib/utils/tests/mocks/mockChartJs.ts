import React from "react";

vi.mock('react-chartjs-2', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Fake = (props: any) =>
    React.createElement('div', {
      role: 'region',
      'aria-label': props['aria-label'] ?? 'vote results pie chart',
    });
  return {
    Pie: Fake,
    Doughnut: Fake,
    Bar: Fake,
    Line: Fake,
    Scatter: Fake,
    Bubble: Fake,
    PolarArea: Fake,
    Radar: Fake,
    Chart: Fake,
  };
});
