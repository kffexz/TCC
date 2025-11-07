 // Config Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyCUD-MKVkhBge2I1cTlxUCgPKLnv_rkJAs",
  authDomain: "tccgymwarriors.firebaseapp.com",
  projectId: "tccgymwarriors",
  storageBucket: "tccgymwarriors.firebasestorage.app",
  messagingSenderId: "990564612699",
  appId: "1:990564612699:web:eb109997deaeac5cf59d7e",
  measurementId: "G-E1P7LCT3EN"
    };

    // Inicializa Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    const logo = document.getElementById('logo');

    // Mostra o logo por 3 segundos antes de redirecionar
    setTimeout(() => {
      // Anima o logo sumindo (1s)
      logo.classList.add('sumir');

      // Após 1s de animação, faz o redirecionamento
      setTimeout(() => {
        auth.onAuthStateChanged(user => {
          if (user) {
            window.location.href = "paginas/home.html";
          } else {
            window.location.href = "paginas/login.html";
          }
        });
      }, 1000); // 1 segundo para o efeito desaparecer
    }, 1000); // 3 segundos de exibição