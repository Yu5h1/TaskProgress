export function nextChoice(items, value) {
  const states = items.filter(item => item.kind !== "action");
  return states.length ? states[(states.findIndex(item => item.id === value) + 1) % states.length].id : undefined;
}

export function pickerChoices(items, value, placement) {
  return placement === "adjacent" ? items.filter(item => item.id !== value) : items;
}
