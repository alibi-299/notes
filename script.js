const addbox = document.querySelector(".add-box"),
  notesWrapper = document.querySelector(".wrepper"),
  popupbox = document.querySelector(".popup-box"),
  popuptitle = popupbox.querySelector("header p"),
  closeIcon = popupbox.querySelector(".close-icon"),
  titletag = popupbox.querySelector("input"),
  desctag = popupbox.querySelector("textarea"),
  form = popupbox.querySelector("form"),
  addBtn = popupbox.querySelector("button");

const monthNames = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isupdate = false,
  updateId;

function openPopup(isUpdate = false) {
  if (!isUpdate) {
    isupdate = false;
    updateId = undefined;
    titletag.value = "";
    desctag.value = "";
  }
  popuptitle.innerText = isUpdate ? "update a note" : "add a new note";
  addBtn.innerText = isUpdate ? "update note" : "add note";
  popupbox.classList.add("show");
  document.querySelector("body").style.overflow = "hidden";
  if (window.innerWidth > 660) titletag.focus();
}

function hidePopup() {
  isupdate = false;
  titletag.value = "";
  desctag.value = "";
  popupbox.classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
}

addbox.addEventListener("click", () => openPopup(false));
closeIcon.addEventListener("click", hidePopup);

function shownote() {
  if (!notes) return;
  document.querySelectorAll(".note").forEach((li) => li.remove());

  notes.forEach((note, id) => {
    const noteItem = document.createElement("li");
    noteItem.className = "note";
    noteItem.dataset.id = id;

    const details = document.createElement("div");
    details.className = "details";

    const titleEl = document.createElement("p");
    titleEl.textContent = note.title;

    const descEl = document.createElement("span");
    descEl.innerHTML = note.description.replaceAll("\n", "<br/>");

    details.appendChild(titleEl);
    details.appendChild(descEl);

    const buttonContent = document.createElement("div");
    buttonContent.className = "button-content";

    const dateEl = document.createElement("span");
    dateEl.textContent = note.date;

    const actions = document.createElement("div");
    actions.className = "note-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "edit-note";
    editButton.dataset.id = id;
    editButton.textContent = "Edit";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-note";
    deleteButton.dataset.id = id;
    deleteButton.textContent = "Delete";

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    const setting = document.createElement("div");
    setting.className = "setting";

    const menuToggle = document.createElement("i");
    menuToggle.className = "uil uil-ellipsis menu-toggle";

    const menu = document.createElement("ul");
    menu.className = "menu";

    const editItem = document.createElement("li");
    editItem.className = "edit-note";
    editItem.dataset.id = id;
    editItem.innerHTML = '<i class="uil uil-pen"></i>edit';

    const deleteItem = document.createElement("li");
    deleteItem.className = "delete-note";
    deleteItem.dataset.id = id;
    deleteItem.innerHTML = '<i class="uil uil-trash"></i>delete';

    menu.appendChild(editItem);
    menu.appendChild(deleteItem);
    setting.appendChild(menuToggle);
    setting.appendChild(menu);
    buttonContent.appendChild(dateEl);
    buttonContent.appendChild(actions);
    buttonContent.appendChild(setting);

    noteItem.appendChild(details);
    noteItem.appendChild(buttonContent);
    notesWrapper.insertBefore(noteItem, addbox.nextSibling);
  });
}

shownote();

function showmenu(elem) {
  const setting = elem.parentElement;
  const menu = elem.nextElementSibling;
  setting.classList.add("show");
  document.addEventListener(
    "click",
    (e) => {
      if (e.target !== elem && !menu.contains(e.target)) {
        setting.classList.remove("show");
      }
    },
    { once: true },
  );
}

function deletenote(noteId) {
  let confirmDel = confirm("are you sure you want to delete this note");
  if (!confirmDel) return;
  notes.splice(noteId, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  shownote();
}

notesWrapper.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".delete-note");
  if (deleteBtn) {
    const noteId = Number(deleteBtn.dataset.id);
    if (Number.isNaN(noteId)) return;
    deletenote(noteId);
    return;
  }

  const editBtn = e.target.closest(".edit-note");
  if (editBtn) {
    const noteId = Number(editBtn.dataset.id);
    if (Number.isNaN(noteId)) return;
    const note = notes[noteId];
    if (!note) return;
    updatenote(noteId, note.title, note.description);
    return;
  }

  const menuToggle = e.target.closest(".menu-toggle");
  if (menuToggle) {
    showmenu(menuToggle);
  }
});

function updatenote(noteId, title, description) {
  updateId = noteId;
  isupdate = true;
  titletag.value = title;
  desctag.value = description;
  openPopup(true);
}

function saveNote() {
  let title = titletag.value.trim();
  let description = desctag.value.trim();
  if (!title && !description) return;

  let currentDate = new Date();
  let month = monthNames[currentDate.getMonth()];
  let day = currentDate.getDate();
  let year = currentDate.getFullYear();
  let noteinfo = {
    title,
    description,
    date: `${month}, ${day}, ${year}`,
  };

  if (!isupdate) {
    notes.push(noteinfo);
  } else {
    notes[updateId] = noteinfo;
    isupdate = false;
  }

  localStorage.setItem("notes", JSON.stringify(notes));
  shownote();
  closeIcon.click();
}

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  saveNote();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  saveNote();
});
