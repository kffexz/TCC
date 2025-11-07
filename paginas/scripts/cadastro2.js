// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCUD-MKVkhBge2I1cTlxUCgPKLnv_rkJAs",
  authDomain: "tccgymwarriors.firebaseapp.com",
  projectId: "tccgymwarriors",
  storageBucket: "tccgymwarriors.firebasestorage.app",
  messagingSenderId: "990564612699",
  appId: "1:990564612699:web:eb109997deaeac5cf59d7e",
  measurementId: "G-E1P7LCT3EN"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Verifica se o usuário está logado
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById('userName').textContent =
      "Nome do usuário: " + (user.displayName || "Sem nome");
  } else {
    window.location.href = 'login.html';
  }
});

// 🔹 Limita altura e peso
const inputAltura = document.getElementById('altura');
inputAltura.addEventListener('input', () => {
  if (inputAltura.value.length > 3) {
    inputAltura.value = inputAltura.value.slice(0, 3);
  }
});

const inputPeso = document.getElementById('peso');
inputPeso.addEventListener('input', () => {
  if (inputPeso.value.length > 3) {
    inputPeso.value = inputPeso.value.slice(0, 3);
  }
});

// 🔹 Define limites para o campo de data (mínimo 14, máximo 130 anos)
const inputData = document.getElementById('dataNascimento');
const hoje = new Date();
const anoAtual = hoje.getFullYear();

// calcula faixas de data
const maxDate = new Date(anoAtual - 14, hoje.getMonth(), hoje.getDate());
const minDate = new Date(anoAtual - 130, hoje.getMonth(), hoje.getDate());

// aplica limites ao input
inputData.max = maxDate.toISOString().split('T')[0];
inputData.min = minDate.toISOString().split('T')[0];

// 🔹 Função para calcular idade
function calcularIdade(dataNascStr) {
  const hoje = new Date();
  const nascimento = new Date(dataNascStr);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

// 🔹 Salvar dados no Firestore
const form = document.getElementById('dadosForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const altura = document.getElementById('altura').value;
  const peso = document.getElementById('peso').value;
  const dataNascimento = document.getElementById('dataNascimento').value;
  const objetivo = document.getElementById('objetivo').value;
  const genero = document.getElementById('genero').value;

  const idade = calcularIdade(dataNascimento);

  // Validação extra no JS
  if (idade < 14 || idade > 130) {
    showCustomAlert("A idade deve estar entre 14 e 130 anos.");
    return;
  }

  const user = auth.currentUser;

  if (user) {
    try {
      const userRef = db.collection('usuarios').doc(user.uid);
      const docSnapshot = await userRef.get();

      if (docSnapshot.exists) {
        const dadosAntigos = docSnapshot.data();
        await userRef.update({
          altura,
          peso,
          idade,
          dataNascimento,
          objetivo,
          genero,
          pesoInicial: dadosAntigos.pesoInicial || peso
        });
      } else {
        await userRef.set({
          altura,
          peso,
          idade,
          dataNascimento,
          objetivo,
          genero,
          pesoInicial: peso
        });
      }

      form.reset();
      showCustomAlert('Dados salvos com sucesso!', () => {
        window.location.href = 'cadastro3.html';
      });
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      showCustomAlert('Erro ao salvar dados. Veja o console.');
    }
  }
});

// ✅ Funções do modal personalizado
let customAlertCallback = null;

function showCustomAlert(message, callback = null) {
  const modal = document.getElementById('customAlert');
  const messageElement = document.getElementById('customAlertMessage');
  messageElement.textContent = message;
  modal.style.display = 'flex';
  customAlertCallback = callback;
}

function closeCustomAlert() {
  const modal = document.getElementById('customAlert');
  modal.style.display = 'none';
  if (typeof customAlertCallback === 'function') {
    customAlertCallback();
    customAlertCallback = null;
  }
}

// 🔹 Exibe a descrição conforme o objetivo selecionado
const objetivoSelect = document.getElementById('objetivo');
const descricaoObjetivo = document.getElementById('descricaoObjetivo');

const descricoes = {
  "Resistência": "Resistência: Focado em aumentar a capacidade muscular e cardiovascular, melhorando a resistência física geral.",
  "Força": "Força: Voltado para o ganho de força e potência muscular, com exercícios de alta intensidade e carga progressiva.",
  "Crescimento": "Crescimento: Indicado para quem busca hipertrofia e aumento do volume muscular.",
  "Funcional": "Funcional: Trabalha movimentos naturais do corpo, melhorando equilíbrio, coordenação e estabilidade.",
  "Aeróbico": "Aeróbico: Ideal para quem deseja melhorar o condicionamento físico e queimar gordura corporal.",
  "Mobilidade": "Mobilidade: Ajuda a aumentar a amplitude dos movimentos, flexibilidade e prevenir lesões."
};

objetivoSelect.addEventListener('change', () => {
  const valor = objetivoSelect.value;
  descricaoObjetivo.textContent = descricoes[valor] || "";
});
