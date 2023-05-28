const noteForm = document.querySelector(".forma_note");
const noteInput = document.querySelector(".input_note");
const errorText = document.querySelector(".error");
const noteList = document.querySelector(".note_list");
const btnAllNote = document.querySelector(".all");
const btnActiveNote = document.querySelector(".open");
const btnDoneNote = document.querySelector(".done");
const inputSearch = document.querySelector(".search");


const colors = [
    "#C71585",
    "#8B008B",
    "#483D8B",
    "#663399",
    "#4B0082",
    "#FF0000",
    "#8B0000",
    "#FF8C00",
    "#BDB76B",
    "#006400",
    "#556B2F",
    "#008B8B",
    "#00008B",
    "#686868",
];
btnAllNote.addEventListener("click", function(){
    btnDoneNote.classList.remove("btn_filter_active");
    btnActiveNote.classList.remove("btn_filter_active");
    btnAllNote.classList.add("btn_filter_active");
    document.querySelectorAll(".note").forEach((item) => {
        item.classList.remove("hidenn");
    });
});
btnActiveNote.addEventListener("click", function(){
    btnAllNote.classList.remove("btn_filter_active");
    btnDoneNote.classList.remove("btn_filter_active");
    btnActiveNote.classList.add("btn_filter_active");
    document.querySelectorAll(".note").forEach((item) => {
        item.classList.add("hidenn");
    });
    document.querySelectorAll(".active").forEach((item) => {
        const task =  item.closest(".note");
        task.classList.remove("hidenn");
     });
});
btnDoneNote.addEventListener("click", function(){
    btnAllNote.classList.remove("btn_filter_active");
    btnActiveNote.classList.remove("btn_filter_active");
    btnDoneNote.classList.add("btn_filter_active");
    document.querySelectorAll(".note").forEach((item) => {
        item.classList.add("hidenn");
    });
    document.querySelectorAll(".note_text_done").forEach((item) => {
       const task =  item.closest(".note");
       task.classList.remove("hidenn");
    });
});

let notes = []
if(localStorage.getItem("notes")){
    notes = JSON.parse(localStorage.getItem("notes"));
}
notes.forEach(function(noteObject){
    const cssClass = noteObject.noteStatus ? 'note_text note_text_done' : 'note_text active';
    let note = document.createElement("li");
    note.id = noteObject.noteId;
    note.className = "note";
    note.innerHTML = `<p class="${cssClass}">${noteObject.noteText}</p>`
    const buttons = `
    <div class="buttins_note">
        <button data-btn="edit" class="btn_edit">
            <img class="status" src="./icons/edit.png" alt="">
        </button>
        <button data-btn="status" class="btn_status">
            <img class="status" src="./icons/check-mark.png" alt="">
        </button> 
        <button data-btn="delete" class="btn_delete">
            <img class="img_delete" src="./icons/dekete.png" alt="">
        </button>
    </div>`;
    note.insertAdjacentHTML("beforeend",buttons)
    note.style.color = noteObject.taskColor;
    noteList.append(note);
})

function addNote(){
     const newNote = {
        noteId: Date.now(),
        noteText: noteInput.value,
        noteStatus: false,
    };
    const cssClass = newNote.noteStatus ? 'note_text note_text_done' : 'note_text active';
    let note = document.createElement("li");
    note.id = newNote.noteId;
    note.className = "note";
    note.innerHTML = `<p class="${cssClass}">${newNote.noteText}</p>`
    const buttons = `
    <div class="buttins_note">
        <button data-btn="edit" class="btn_edit">
            <img class="status" src="./icons/edit.png" alt="">
        </button>
        <button data-btn="status" class="btn_status">
            <img class="status" src="./icons/check-mark.png" alt="">
        </button> 
        <button data-btn="delete" class="btn_delete">
            <img class="delete" src="./icons/dekete.png" alt="">
        </button>
    </div>`;
    note.insertAdjacentHTML("beforeend",buttons)
    noteList.append(note);
    colorGenerator(note,newNote)
    notes.push(newNote);
    seveInLocalStorage();
    noteInput.value = "";
    return note;
};
noteForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    if(noteInput.value.trim() === "" ){
        noteInput.style.borderColor = "#ff0000";
        errorText.classList.add("error_active");
    }else{
        noteInput.style.borderColor = "#b7babd";
        errorText.classList.remove("error_active");
        addNote();
    }
});

function editNote(e){
    if(e.target.dataset.btn === "edit"){
        const note = e.target.closest(".note");
        const editNoteHtml = `
        <div class="edit_note">
            <input type="text" class="edit_input">
            <button class="btn_save_note">Сохранить</button>
        </div>`;
        note.insertAdjacentHTML("beforeend",editNoteHtml)
        const editNoteDiv = document.querySelector(".edit_note");
        const inputEditNote = document.querySelector(".edit_input");
        const btnSaveNote = document.querySelector(".btn_save_note");
        const noteText = note.querySelector(".note_text");
        inputEditNote.value = noteText.innerHTML;
        const noteId = Number(note.id);
        const filterNote = notes.find(function(note){
            if(note.noteId === noteId){
                return true;
            };
        });
        btnSaveNote.addEventListener("click",function(){
            const noteText = note.querySelector(".note_text");
            noteText.innerHTML = inputEditNote.value;
            editNoteDiv.remove();
            filterNote.noteText = inputEditNote.value;
            seveInLocalStorage();
        });
    };
};
noteList.addEventListener("click",editNote)

function statusNote(e){
    if(e.target.dataset.btn === "status"){
        const note = e.target.closest(".note");
        const noteText = note.querySelector(".note_text");
        noteText.classList.toggle("note_text_done");
        noteText.classList.toggle("active");
        const noteId = Number(note.id);
        const filterNote = notes.find(function(note){
            if(note.noteId === noteId){
                return true;
            }
        });
        filterNote.noteStatus = !filterNote.noteStatus;
        seveInLocalStorage()
    };
};
noteList.addEventListener("click", statusNote);

function deleteNote(e){
    if(e.target.dataset.btn === "delete"){
        const note = e.target.closest(".note");
        const noteId = Number(note.id);
        notes = notes.filter(function(note){
            return  note.noteId !== noteId; 
        })
        seveInLocalStorage();
        note.remove();
    };
};
noteList.addEventListener("click", deleteNote);

function seveInLocalStorage(){
    localStorage.setItem("notes", JSON.stringify(notes))
};

function searchNote(){
    let searchValue = inputSearch.value.trim()
    const listNotes = document.querySelectorAll(".note")
    if(searchValue != ""){
        listNotes.forEach(function(item){
           if(item.innerText.search(searchValue) == -1){
            item.classList.add("hidenn")
           }else{
            item.classList.remove("hidenn")
           }
        })
    }else{
        listNotes.forEach(function(item){
             item.classList.remove("hidenn")
         })  
    }
};
inputSearch.addEventListener("input", searchNote)

function getRandomNambers(){
    return Math.floor(Math.random() * colors.length);
};
function colorGenerator(note,newNote){
    let colorText = colors[getRandomNambers()]
    note.style.color = colorText;
    newNote.taskColor = colorText;
};

