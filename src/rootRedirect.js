if (typeof window !== 'undefined') {
  const from = window.location.pathname;
  const redirectTargets = new Set(['/', '/docs', '/docs/']);

  if (redirectTargets.has(from)) {
    window.location.replace('/en/latest/');
  }
}
