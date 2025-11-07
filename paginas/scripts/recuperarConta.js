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

    const email = new URLSearchParams(window.location.search).get("email");

    document.getElementById("reativarBtn").addEventListener("click", async () => {
      try {
        const password = prompt("Digite sua senha para confirmar a reativação:");
        if (!password) return;

        // Login para reautenticação
        const cred = await auth.signInWithEmailAndPassword(email, password);
        const user = cred.user;

        // Atualiza o campo 'ativo'
        await db.collection("usuarios").doc(user.uid).update({
          ativo: true,
          deletedAt: firebase.firestore.FieldValue.delete()
        });

        alert("Conta reativada com sucesso!");
        window.location.href = "home.html";
      } catch (error) {
        console.error("Erro ao reativar:", error);
        if (error.code === "auth/wrong-password") {
          alert("Senha incorreta. Tente novamente.");
        } else if (error.code === "auth/user-not-found") {
          alert("Usuário não encontrado.");
        } else {
          alert("Não foi possível reativar a conta. Tente novamente mais tarde.");
        }
      }
    });