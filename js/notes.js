export function createNote(text) {
  return {
    id: Date.now(),
    text: text
  };
}