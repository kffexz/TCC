  // Firebase Config
    const firebaseConfig = {
      apiKey: "AIzaSyAbVJUTwovjKHua6OWP_yIncKYytEEwPfo",
      authDomain: "tcc-994f7.firebaseapp.com",
      projectId: "tcc-994f7",
      storageBucket: "tcc-994f7.firebasestorage.app",
      messagingSenderId: "848443566233",
      appId: "1:848443566233:web:b9be3b2beccb027fa53008",
      measurementId: "G-SGB2LYMT17"
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

    // Salvar dados no Firestore
    const form = document.getElementById('dadosForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const altura = document.getElementById('altura').value;
      const peso = document.getElementById('peso').value;
      const idade = document.getElementById('idade').value;
      const objetivo = document.getElementById('objetivo').value;
      const genero = document.getElementById('genero').value;

      const user = auth.currentUser;
      if (user) {
        db.collection('usuarios').doc(user.uid).set({
          altura,
          peso,
          idade,
          objetivo,
          genero
        })
          .then(() => {
            form.reset();
            showCustomAlert('Dados salvos com sucesso!', () => {
              window.location.href = 'cadastro3.html';
            });
          })
          .catch((error) => {
            console.error('Erro ao salvar dados:', error);
            showCustomAlert('Erro ao salvar dados. Veja o console.');
          });
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

    // Exibe a descrição conforme o objetivo selecionado
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


