// ==========================
// Configuração Firebase
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
// Monitorar autenticação
// ==========================
auth.onAuthStateChanged((user) => {
  if (user) {
    db.collection("usuarios")
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const dados = doc.data();

          // Verifica se o usuário não tem nenhum dado além do nome
          const semDados =
            (!dados.idade && !dados.peso && !dados.altura && !dados.objetivo && (!dados.equipamentos || dados.equipamentos.length === 0));

          if (semDados) {
            document.querySelector(".perfil-info").innerHTML =
              "<p style='font-family: Poppins;'><strong>Dados não encontrados.</strong></p><p>Por favor, termine de realizar seu <a href='cadastro2.html' style='text-decoration:none; color: #FFFF;'><strong>cadastro</strong></a></p>";
            return;
          }

          // Se o usuário tiver dados, mostra normalmente
          document.getElementById("userName").textContent = user.displayName || "---";
          document.getElementById("perfilIdade").textContent = dados.idade || "---";
          document.getElementById("perfilPeso").textContent = dados.peso || "---";
          document.getElementById("perfilAltura").textContent = dados.altura || "---";
          document.getElementById("perfilObjetivo").textContent = dados.objetivo || "---";

          if (dados.equipamentos && dados.equipamentos.length > 0) {
            document.getElementById("perfilEquipamentos").textContent =
              dados.equipamentos.join(", ");
          } else {
            document.getElementById("perfilEquipamentos").textContent =
              "Nenhum equipamento selecionado";
          }

        } else {
          // <-- aqui está o seu else original
          document.querySelector(".perfil-info").innerHTML =
            "<p style='font-family: Poppins;'><strong>Dados não encontrados.</strong></p><br><p>Por favor, termine de realizar seu <a href='cadastro2.html' style='text-decoration:none; color: #FFFF;'><strong>cadastro</strong></a></p>";
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar dados do usuário:", err);
        showCustomAlert("Erro ao carregar perfil. Tente novamente.");
      });
  } else {
    window.location.href = "login.html";
  }
});

// ==========================
// Botões de navegação
// ==========================
document.getElementById("editEquipamentosBtn")?.addEventListener("click", () => {
  window.location.href = "cadastro3.html";
});

document.getElementById("editarPerfilBtn")?.addEventListener("click", () => {
  window.location.href = "editPerfil.html";
});

// ==========================
// 🔹 Logout com modal de confirmação
// ==========================
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  showConfirmModal("Tem certeza que deseja sair da conta?", async () => {
    await auth.signOut();
    window.location.href = "login.html";
  });
});

// ==========================
// 🔴 Desativar Conta (bloqueio de login, sem excluir do Auth)
// ==========================
const desativarBtn = document.getElementById("deleteAccountBtn");

desativarBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  showConfirmModal("Tem certeza que deseja excluir sua conta?", async () => {
    try {
      // Marca o usuário como inativo no Firestore
      await db.collection("usuarios").doc(user.uid).update({
        ativo: false,
        deletedAt: new Date()
      });

      // Faz logout para encerrar a sessão
      await auth.signOut();

      showCustomAlert("Sua conta foi excluída.", () => {
        window.location.href = "login.html";
      });

    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      showCustomAlert("Erro ao excluir a conta. Tente novamente mais tarde.");
    }
  });
});



// ==========================
// ⚙️ Modal personalizado (alert + confirmação)
// ==========================
let customAlertCallback = null;
let confirmCallback = null;

function showCustomAlert(message, callback = null) {
  const modal = document.getElementById("customAlert");
  const msg = document.getElementById("customAlertMessage");
  const confirmBtn = document.getElementById("confirmBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  msg.textContent = message;
  modal.style.display = "flex";
  cancelBtn.style.display = "none"; // só 1 botão

  confirmBtn.onclick = () => {
    modal.style.display = "none";
    if (typeof callback === "function") callback();
  };
}

function showConfirmModal(message, onConfirm) {
  const modal = document.getElementById("customAlert");
  const msg = document.getElementById("customAlertMessage");
  const confirmBtn = document.getElementById("confirmBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  msg.textContent = message;
  modal.style.display = "flex";
  cancelBtn.style.display = "inline-block"; // mostra ambos

  confirmBtn.onclick = () => {
    modal.style.display = "none";
    if (typeof onConfirm === "function") onConfirm();
  };

  cancelBtn.onclick = () => {
    modal.style.display = "none";
  };
}

// ==========================
// Correção de abas inferiores
// ==========================
const tabs = document.querySelectorAll(".tab");
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
  });
});
