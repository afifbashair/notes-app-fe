const API_URL = "https://be-rest-276882742884.us-central1.run.app/notes";

const inputJudul = document.getElementById('judul');
const inputIsi = document.getElementById('isi');
const btn = document.getElementById('btnSubmit');
const list = document.getElementById('list');

let editId = null;

/* ================= GET ================= */
async function getNotes() {
  const res = await fetch(API);
  const data = await res.json();

  list.innerHTML = '';

  data.forEach(note => {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note';

    const title = document.createElement('div');
    title.className = 'note-title';
    title.innerText = note.judul;

    const isi = document.createElement('div');
    isi.innerText = note.isi;

    const date = document.createElement('div');
    date.className = 'note-date';
    date.innerText = new Date(note.tanggal_dibuat).toLocaleString();

    const actions = document.createElement('div');
    actions.className = 'note-actions';

    const btnEdit = document.createElement('button');
    btnEdit.innerText = 'Edit';
    btnEdit.className = 'btn-edit';
    btnEdit.onclick = () => edit(note);

    const btnDelete = document.createElement('button');
    btnDelete.innerText = 'Hapus';
    btnDelete.className = 'btn-delete';
    btnDelete.onclick = () => hapus(note.id);

    actions.appendChild(btnEdit);
    actions.appendChild(btnDelete);

    noteDiv.appendChild(title);
    noteDiv.appendChild(isi);
    noteDiv.appendChild(date);
    noteDiv.appendChild(actions);

    list.appendChild(noteDiv);
  });
}

/* ================= EDIT ================= */
function edit(note) {
  inputJudul.value = note.judul;
  inputIsi.value = note.isi;

  editId = note.id;

  btn.innerText = 'Update';
  btn.className = 'btn-edit';
}

/* ================= ADD / UPDATE ================= */
btn.onclick = async () => {
  const judul = inputJudul.value.trim();
  const isi = inputIsi.value.trim();

  if (!judul || !isi) {
    alert('Judul dan isi tidak boleh kosong!');
    return;
  }

  if (editId === null) {
    // tambah
    await fetch(API, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ judul, isi })
    });
  } else {
    // update
    await fetch(`${API}/${editId}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ judul, isi })
    });

    editId = null;
    btn.innerText = 'Tambah';
    btn.className = 'btn-add';
  }

  inputJudul.value = '';
  inputIsi.value = '';

  getNotes();
};

/* ================= DELETE ================= */
async function hapus(id) {
  if (confirm('Yakin hapus catatan ini?')) {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    getNotes();
  }
}

/* ================= INIT ================= */
getNotes();