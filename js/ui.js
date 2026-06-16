export function renderNotes(notes, container, deleteHandler) {
  container.innerHTML = "";

  notes.forEach(note => {
    const div = document.createElement("div");
    div.classList.add("note");

    div.innerHTML = `
      <p>${note.text}</p>
      <button onclick="deleteNote(${note.id})">Delete</button>
    `;

    container.appendChild(div);
  });
}