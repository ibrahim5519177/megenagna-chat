import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// 🔥 Your Firebase config here:
const firebaseConfig = {
  apiKey: "AIzaSyDehexghO-7e6CdxeyJVpDE5aNR9ewsdTI",
  authDomain: "megenagna-6d6c5.firebaseapp.com",
  projectId: "megenagna-6d6c5",
  storageBucket: "megenagna-6d6c5.firebasestorage.app",
  messagingSenderId: "815991954134",
  appId: "1:815991954134:web:05b0b291d5fca5b722c777"
};

// 🔧 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔒 Auth State
onAuthStateChanged(auth, user => {
  const chatSection = document.getElementById('chatSection');
  chatSection.style.display = user ? 'block' : 'none';
  if (user) {
    listenForMessages();
  }
});

// 🆕 Sign Up
window.signUp = async function () {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (e) {
    alert(e.message);
  }
};

// 🔐 Login
window.login = async function () {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    alert(e.message);
  }
};

// 🚪 Logout
window.logout = function () {
  signOut(auth);
};

// 📤 Send Message
window.sendMessage = async function () {
  const input = document.getElementById('messageInput');
  if (!input.value.trim()) return;
  await addDoc(collection(db, 'messages'), {
    text: input.value,
    uid: auth.currentUser.uid,
    email: auth.currentUser.email,
    timestamp: serverTimestamp()
  });
  input.value = '';
};

// 📥 Listen for Messages
function listenForMessages() {
  const chatBox = document.getElementById('chat');
  const q = query(collection(db, 'messages'), orderBy('timestamp'));
  onSnapshot(q, snapshot => {
    chatBox.innerHTML = '';
    snapshot.forEach(doc => {
      const msg = doc.data();
      chatBox.innerHTML += `<div class="message"><b>${msg.email}:</b> ${msg.text}</div>`;
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}
