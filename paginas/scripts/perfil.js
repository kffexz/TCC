 // Configuração Firebase
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

        // Monitorar autenticação do usuário
        auth.onAuthStateChanged((user) => {
            if (user) {
                db.collection("usuarios")
                    .doc(user.uid)
                    .get()
                    .then((doc) => {
                        if (doc.exists) {
                            const dados = doc.data();
                            document.getElementById("userName").textContent = user.displayName || "---";
                            document.getElementById("perfilIdade").textContent = dados.idade || "---";
                            document.getElementById("perfilPeso").textContent = dados.peso || "---";
                            document.getElementById("perfilAltura").textContent = dados.altura || "---";
                            document.getElementById("perfilObjetivo").textContent = dados.objetivo || "---";

                            if (dados.equipamentos && dados.equipamentos.length > 0) {
                                document.getElementById("perfilEquipamentos").textContent = dados.equipamentos.join(", ");
                            } else {
                                document.getElementById("perfilEquipamentos").textContent = "Nenhum equipamento selecionado";
                            }
                        } else {
                            document.querySelector(".perfil-info").innerHTML = "<p style='font-family: Poppins;'><strong>Dados não encontrados.</strong></p><br><p>Por favor, termine de realizar seu <a href='cadastro2.html' style='text-decoration:none; color: #FFFF;'><strong>cadastro</strong></a></p>";
                        }
                    })
                    .catch((err) => {
                        console.error("Erro ao buscar dados do usuário:", err);
                    });
            } else {
                window.location.href = "login.html";
            }
        });

        // Botão editar equipamentos
        document.getElementById("editEquipamentosBtn")?.addEventListener("click", () => {
            window.location.href = "cadastro3.html";
        });

        // Botão editar perfil
        document.getElementById("editarPerfilBtn")?.addEventListener("click", () => {
            window.location.href = "editPerfil.html";
        });

        // Botão logout
        document.getElementById("logoutBtn")?.addEventListener("click", () => {
            auth.signOut().then(() => window.location.href = "login.html");
        });

        // Correção do erro "tabs is not defined"
        const tabs = document.querySelectorAll(".tab");
        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                tabs.forEach((t) => t.classList.remove("active"));
                tab.classList.add("active");
            });
        });