  // Config Firebase
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

    const equipamentos = [
      { nome: "Halteres", img: "../img/halteres.png" },
      { nome: "Barra", img: "../img/barra.png" },
      { nome: "Elástico", img: "../img/elastico.png" },
      { nome: "Kettlebell", img: "../img/kettlebell.png" },
      { nome: "Corda", img: "../img/corda.png" },
      { nome: "Esteira", img: "../img/esteira.png" },
      { nome: "Corda naval", img: "../img/cordanaval.jpeg" },
      { nome: "Corpo", img: "../img/sem_equipamento.jpg" }
    ];

    const selecionados = new Set();

    function renderEquipamentos() {
      const grid = document.getElementById('equipamentosGrid');
      equipamentos.forEach(equip => {
        const div = document.createElement('div');
        div.className = 'equipamento';
        div.innerHTML = `
          <img src="${equip.img}" alt="${equip.nome}" />
          <p>${equip.nome}</p>
        `;
        div.addEventListener('click', () => {
          if (selecionados.has(equip.nome)) {
            selecionados.delete(equip.nome);
            div.classList.remove('selecionado');
          } else {
            selecionados.add(equip.nome);
            div.classList.add('selecionado');
          }
        });
        grid.appendChild(div);
      });
    }

    function salvarEquipamentos() {
      const user = auth.currentUser;
      if (!user) {
        showCustomAlert('Usuário não logado');
        return;
      }

      db.collection('usuarios').doc(user.uid).update({
        equipamentos: Array.from(selecionados)
      })
        .then(() => {
          showCustomAlert('Equipamentos salvos com sucesso!');
          customAlertCallback = () => {
            window.location.href = 'home.html';
          };
        })
        .catch((error) => {
          console.error("Erro ao salvar:", error);
          showCustomAlert('Erro ao salvar equipamentos.');
        });
    }

    auth.onAuthStateChanged(user => {
      if (user) {
        renderEquipamentos();
      } else {
        window.location.href = 'login.html';
      }
    });

    // Modal personalizado
    function showCustomAlert(message) {
      const modal = document.getElementById('customAlert');
      const messageElement = document.getElementById('customAlertMessage');
      messageElement.textContent = message;
      modal.style.display = 'block';
    }

    let customAlertCallback = null;

    function closeCustomAlert() {
      document.getElementById('customAlert').style.display = 'none';
      if (typeof customAlertCallback === 'function') {
        customAlertCallback();
        customAlertCallback = null;
      }
    }