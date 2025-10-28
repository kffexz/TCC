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