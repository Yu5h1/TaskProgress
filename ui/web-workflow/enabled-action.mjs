// Disabled product capabilities should not install global gesture listeners.
// Re-enable with current options; disposal also cancels an in-flight gesture.
export function enabledAction(factory, isEnabled = options => options.enabled !== false) {
  return (node, initial) => {
    let binding;
    const update = options => {
      if (!isEnabled(options)) { binding?.destroy(); binding = undefined; }
      else if (binding) binding.update?.(options);
      else binding = factory(node, options);
    };
    update(initial);
    return { update, destroy() { binding?.destroy(); binding = undefined; } };
  };
}
