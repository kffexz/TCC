 // =============================
    // CONFIGURAÇÃO FIREBASE
    // =============================
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

   // =============================
    // VERIFICA O LOGIN
    // =============================

      auth.onAuthStateChanged(user => {
    if (!user) {
      // Usuário não logado → redireciona para login
      window.location.href = 'login.html';
    }
  });
    // =============================
    // LOGIN / LOGOUT
    // =============================
 

    document.getElementById('logoutBtn').addEventListener('click', () => {
      auth.signOut().then(() => {
        window.location.href = 'login.html';
      });
    });

    // =============================
    // NAVEGAÇÃO ENTRE ABAS
    // =============================
    const tabs = document.querySelectorAll('.tab');
    const conteudo = document.getElementById('conteudo');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const nomeAba = tab.dataset.tab;
        conteudo.innerHTML = paginas[nomeAba];

        // Reatribuir o botão de logout quando for Home
        if (nomeAba === 'home') {
          document.getElementById('logoutBtn').addEventListener('click', () => {
            auth.signOut().then(() => {
              window.location.href = 'login.html';
            });
          });
        }
      });
    });