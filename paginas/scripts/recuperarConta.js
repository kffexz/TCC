document.addEventListener("DOMContentLoaded", () => {
  // ==========================
  // Firebase Config
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

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();

  // ==========================
  // Elementos da interface
  // ==========================
  const email = new URLSearchParams(window.location.search).get("email");
  const modal = document.getElementById("modalSenha");
  const inputSenha = document.getElementById("inputSenha");
  const confirmSenhaBtn = document.getElementById("confirmSenhaBtn");
  const cancelSenhaBtn = document.getElementById("cancelSenhaBtn");
  const reativarBtn = document.getElementById("reativarBtn");
  const msgModal = document.getElementById("mensagemModal");

  // Função para exibir mensagem no modal
  function mostrarMensagem(texto, tipo = "info") {
    msgModal.textContent = texto;
    msgModal.className = `msg-modal msg-${tipo}`;
  }

  // ==========================
  // Abre modal
  // ==========================
  reativarBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    inputSenha.value = "";
    msgModal.textContent = "";
    inputSenha.focus();
  });

  // ==========================
  // Fecha modal
  // ==========================
  cancelSenhaBtn.addEventListener("click", () => {
    modal.style.display = "none";
    msgModal.textContent = "";
  });

  // Fecha ao clicar fora
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      msgModal.textContent = "";
    }
  });

  // ==========================
  // Confirmar senha e reativar
  // ==========================
  confirmSenhaBtn.addEventListener("click", async () => {
    const password = inputSenha.value.trim();

    if (!password) {
      mostrarMensagem("Digite sua senha.", "erro");
      return;
    }

    mostrarMensagem("Verificando senha...", "info");

    try {
      const cred = await auth.signInWithEmailAndPassword(email, password);
      const user = cred.user;

      await db.collection("usuarios").doc(user.uid).update({
        ativo: true,
        deletedAt: firebase.firestore.FieldValue.delete()
      });

      mostrarMensagem("Conta reativada com sucesso!", "sucesso");

      setTimeout(() => {
        modal.style.display = "none";
        window.location.href = "home.html";
      }, 1200);
    } catch (error) {
      console.error("Erro ao reativar:", error);
      if (error.code === "auth/wrong-password") {
        mostrarMensagem("Senha incorreta. Tente novamente.", "erro");
      } else if (error.code === "auth/user-not-found") {
        mostrarMensagem("Usuário não encontrado.", "erro");
      } else if (error.code === "auth/invalid-login-credentials") {
        mostrarMensagem("Senha incorreta. Tente novamente", "erro")
      } else {
        mostrarMensagem("Erro inesperado. Tente novamente.", "erro");
      }
    }
  });
});
