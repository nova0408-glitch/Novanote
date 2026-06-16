export function saveNotes(notes) {
  localStorage.setItem("novanotes", JSON.stringify(notes));
}

export function loadNotes() {
  return JSON.parse(localStorage.getItem("novanotes")) || [];
}