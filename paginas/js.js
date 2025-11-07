// ==========================
// 🔥 Configuração do Firebase (modo compat v9, estilo v8)
// ==========================
const firebaseConfig = {
  apiKey: "AIzaSyCUD-MKVkhBge2I1cTlxUCgPKLnv_rkJAs",
  authDomain: "tccgymwarriors.firebaseapp.com",
  projectId: "tccgymwarriors",
  storageBucket: "tccgymwarriors.firebasestorage.app",
  messagingSenderId: "990564612699",
  appId: "1:990564612699:web:eb109997deaeac5cf59d7e",
  measurementId: "G-E1P7LCT3EN"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Inicializa serviços
const auth = firebase.auth();
let db;
try {
  // Firestore pode não existir em todas as páginas (ex: login.html)
  db = firebase.firestore();
} catch (e) {
  console.warn("Firestore não foi carregado nesta página.");
}

// ==========================
// 🧩 Função de cadastro
// ==========================
async function cadastrar() {
  const nome = document.getElementById('cadNome').value.trim();
  const email = document.getElementById('cadEmail').value.trim().toLowerCase();
  const senha = document.getElementById('cadSenha').value.trim();
  const confirmar = document.getElementById('cadConfirmar').value.trim();
  const checkSaude = document.getElementById('checkSaude');
  const checkTermos = document.getElementById('checkTermos');
  const msg = document.getElementById('msgCadastro');

  msg.style.color = 'red';
  msg.textContent = '';

  // Validações
  if (!nome || !email || !senha || !confirmar) {
    msg.textContent = "Preencha todos os campos corretamente!";
    return;
  }
  if (senha !== confirmar) {
    msg.textContent = "As senhas não coincidem!";
    return;
  }
  if (!checkSaude.checked) {
    msg.textContent = "Você deve confirmar que está apto(a) para realizar os treinos.";
    return;
  }
  if (!checkTermos.checked) {
    msg.textContent = "Você deve aceitar os termos de uso.";
    return;
  }
  if (!email.endsWith("@gmail.com")) {
    msg.textContent = "Use um e-mail do Gmail.";
    return;
  }

  try {
    const methods = await auth.fetchSignInMethodsForEmail(email);
    if (methods.length > 0) {
      msg.textContent = "Este e-mail já está registrado!";
      return;
    }

    const userCredential = await auth.createUserWithEmailAndPassword(email, senha);
    await userCredential.user.updateProfile({ displayName: nome });

    // Cria documento no Firestore (se Firestore estiver disponível)
    if (db) {
      await db.collection("usuarios").doc(userCredential.user.uid).set({
        nome,
        email,
        ativo: true,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }

    msg.style.color = 'white';
    msg.textContent = "Cadastro realizado! Redirecionando...";

    document.getElementById('cadNome').value = '';
    document.getElementById('cadEmail').value = '';
    document.getElementById('cadSenha').value = '';
    document.getElementById('cadConfirmar').value = '';
    checkSaude.checked = false;
    checkTermos.checked = false;

    setTimeout(() => {
      window.location.href = 'cadastro2.html';
    }, 1200);
  } catch (error) {
    msg.style.color = 'red';
    if (error.code === 'auth/invalid-email') msg.textContent = "Email inválido!";
    else if (error.code === 'auth/weak-password') msg.textContent = "A senha deve ter no mínimo 6 caracteres!";
    else if (error.code === 'auth/email-already-in-use') msg.textContent = "Email já está em uso!";
    else msg.textContent = "Erro: " + error.message;
  }
}
// ==========================
// 🔐 Função de login
// ==========================
async function login() {
  const email = document.getElementById('logEmail').value.trim().toLowerCase();
  const senha = document.getElementById('logSenha').value.trim();
  const msg = document.getElementById('msgLogin');

  msg.textContent = '';

  if (!email || !senha) {
    msg.style.color = 'red';
    msg.textContent = "Preencha email e senha corretamente!";
    return;
  }

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, senha);
    const user = userCredential.user;

    // 🔍 Verifica se o Firestore está disponível e se o usuário está ativo
    if (db) {
      const userDoc = await db.collection("usuarios").doc(user.uid).get();

      if (userDoc.exists && userDoc.data().ativo === false) {
        await auth.signOut();
        msg.style.color = 'orange';
        msg.textContent = "Esta conta foi desativada. Redirecionando para recuperação...";

        setTimeout(() => {
          window.location.href = "recuperarConta.html?email=" + encodeURIComponent(email);
        }, 1800);
        return;
      }
    }

    msg.style.color = 'white';
    msg.textContent = `Login realizado! Bem-vindo, ${user.displayName || "usuário"}!`;

    setTimeout(() => {
      window.location.href = 'home.html';
    }, 1200);

  } catch (error) {
    msg.style.color = 'red';
    if (error.code === 'auth/user-not-found') msg.textContent = "Usuário não encontrado.";
    else if (error.code === 'auth/wrong-password') msg.textContent = "Senha incorreta!";
    else if (error.code === 'auth/invalid-login-credentials') msg.textContent = "Email ou senha inválidos.";
    else if (error.code === 'auth/invalid-email') msg.textContent = "Email inválido!";
    else msg.textContent = "Erro: " + error.message;
  }
}


// ==========================
// 🔄 Recuperação de senha
// ==========================
function recuperarSenha() {
  const email = document.getElementById('logEmail').value.trim().toLowerCase();
  const msg = document.getElementById('msgLogin');

  if (!email) {
    msg.style.color = 'red';
    msg.textContent = "Digite seu e-mail de login para recuperar a senha.";
    return;
  }

  auth.sendPasswordResetEmail(email)
    .then(() => {
      msg.style.color = '#00aea8';
      msg.textContent = "Link de recuperação enviado para o seu e-mail!";
    })
    .catch(error => {
      msg.style.color = 'red';
      if (error.code === 'auth/user-not-found') {
        msg.textContent = "Nenhuma conta encontrada com este e-mail.";
      } else if (error.code === 'auth/invalid-email') {
        msg.textContent = "E-mail inválido. Verifique o formato.";
      } else {
        msg.textContent = "Erro ao enviar link: " + error.message;
      }
    });
}
