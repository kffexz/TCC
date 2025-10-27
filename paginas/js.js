// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAbVJUTwovjKHua6OWP_yIncKYytEEwPfo",
  authDomain: "tcc-994f7.firebaseapp.com",
  projectId: "tcc-994f7",
  storageBucket: "tcc-994f7.appspot.com",
  messagingSenderId: "848443566233",
  appId: "1:848443566233:web:b9be3b2beccb027fa53008",
  measurementId: "G-SGB2LYMT17"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Função de cadastro
function cadastrar() {
  const nome = document.getElementById('cadNome').value.trim();
  const email = document.getElementById('cadEmail').value.trim();
  const senha = document.getElementById('cadSenha').value.trim();
  const checkSaude = document.getElementById('checkSaude'); // ✅ Checkbox de saúde
  const msg = document.getElementById('msgCadastro');

  msg.style.color = 'red';
  msg.textContent = '';

  // Validação de campos obrigatórios
  if (!nome || !email || !senha) {
    msg.textContent = "Preencha todos os campos corretamente!";
    return;
  }

  // Verifica se marcou a checkbox
  if (!checkSaude || !checkSaude.checked) {
    msg.textContent = "Você deve confirmar que está apto(a) para realizar os treinos.";
    return;
  }

  // Verifica se é Gmail
  if (!email.toLowerCase().endsWith("@gmail.com")) {
    msg.textContent = "Use um e-mail do Gmail.";
    return;
  }

  // Verifica se o e-mail já está em uso
  auth.fetchSignInMethodsForEmail(email)
    .then(methods => {
      if (methods.length > 0) {
        msg.textContent = "Este e-mail já está registrado!";
        return;
      }

      // Cadastra o usuário
      return auth.createUserWithEmailAndPassword(email, senha);
    })
    .then(userCredential => {
      if (!userCredential) return;

      return userCredential.user.updateProfile({ displayName: nome });
    })
    .then(() => {
      msg.style.color = 'white';
      msg.textContent = "Cadastro realizado! Redirecionando...";

      // Limpa campos
      document.getElementById('cadNome').value = '';
      document.getElementById('cadEmail').value = '';
      document.getElementById('cadSenha').value = '';
      checkSaude.checked = false;

      setTimeout(() => {
        window.location.href = 'cadastro2.html';
      }, 1000);
    })
    .catch(error => {
      msg.style.color = 'red';
      if (error.code === 'auth/invalid-email') msg.textContent = "Email inválido!";
      else if (error.code === 'auth/weak-password') msg.textContent = "A senha deve ter no mínimo 6 caracteres!";
      else if (error.code === 'auth/email-already-in-use') msg.textContent = "Email registrado já está em uso!";
      else msg.textContent = "Erro: " + error.message;
    });
}

// Função de login
function login() {
  const email = document.getElementById('logEmail').value.trim();
  const senha = document.getElementById('logSenha').value.trim();
  const msg = document.getElementById('msgLogin');

  if (!email || !senha) {
    msg.style.color = 'red';
    msg.textContent = "Preencha email e senha corretamente!";
    return;
  }

  auth.signInWithEmailAndPassword(email, senha)
    .then(userCredential => {
      const user = userCredential.user;
      msg.style.color = 'white';
      msg.textContent = `Login realizado! Bem-vindo, ${user.displayName || "usuário"}!`;

      setTimeout(() => {
        window.location.href = 'home.html';
      }, 1500);
    })
    .catch(error => {
      msg.style.color = 'red';
      if (error.code === 'auth/user-not-found') msg.textContent = "Usuário não encontrado.";
      else if (error.code === 'auth/wrong-password') msg.textContent = "Senha incorreta!";
      else if (error.code === 'auth/invalid-login-credentials') msg.textContent = "Email ou senha inválidos.";
      else if (error.code === 'auth/invalid-email') msg.textContent = "Email inválido! Use um Gmail válido.";
      else msg.textContent = "Erro: " + error.message;
    });
}

// ✅ Função de recuperação de senha (Movida para o escopo global)
function recuperarSenha() {
    // Pega o email do campo de login (logEmail)
    const email = document.getElementById('logEmail').value.trim();
    const msg = document.getElementById('msgLogin'); // Reutiliza a mensagem de login

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
            // Exibe erro de e-mail não encontrado ou inválido
            if (error.code === 'auth/user-not-found') {
                msg.textContent = "Nenhuma conta encontrada com este e-mail.";
            } else if (error.code === 'auth/invalid-email') {
                msg.textContent = "E-mail inválido. Por favor, verifique o formato.";
            } else {
                msg.textContent = "Erro ao enviar link: " + error.message;
            }
        });
}


// Funções auxiliares (Modal, etc.)
function showCustomAlert(message) {
  const modal = document.getElementById('customAlert');
  const messageElement = document.getElementById('customAlertMessage');
  messageElement.textContent = message;
  modal.style.display = 'block';
}

function closeCustomAlert() {
  document.getElementById('customAlert').style.display = 'none';
}

// Filtragem de entrada
const inputsTexto = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');

function cleanInput(text) {
  // Letras, números e símbolos comuns
  return text.replace(/[^\w\s.,\-_'\"!@#$%&*();:?]/g, '');
}

inputsTexto.forEach(input => {
  input.addEventListener('input', () => {
    input.value = cleanInput(input.value);
  });
}); 
