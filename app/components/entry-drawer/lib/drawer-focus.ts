export function focusPreferredField(event: Event) {
  const container = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
  const field = container?.querySelector<HTMLElement>("[data-autofocus]");

  if (field) {
    event.preventDefault();
    field.focus();
  }
}
