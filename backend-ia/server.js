    // =========================================================
    // 🚀 BACKEND TCC - GYM WARRIORS (AJUSTE FINAL)
    // 🧠 INTEGRAÇÃO COM OPENAI (GPT-3.5-TURBO)
    // =========================================================

    const express = require('express');
    const cors = require('cors');
    require('dotenv').config(); // Carrega variáveis do .env
    const { OpenAI } = require('openai'); // SDK da OpenAI

    const app = express();
    const port = 3001; 

    // 🔑 Inicializa o cliente OpenAI
    const openai = new OpenAI({}); 

    // ----------------------
    // MIDDLEWARES
    // ----------------------
    app.use(express.json()); // Permite ler JSON nas requisições POST

    // 🌍 Habilita CORS
    app.use(cors({ 
        origin: 'http://127.0.0.1:5500' // Ajuste conforme seu frontend
    })); 

    // ======================================
    // 🧠 ROTA PRINCIPAL: GERAR TREINO COM OPENAI
    // ======================================
    app.post('/api/gerar-treino', async (req, res) => {
        try {
            // Recebe todos os dados do usuário, agora com 'idade' em vez de 'dataNascimento'
            const { objetivo, equipamentos, peso, altura, idade } = req.body; 
            
            // 🚨 Validação completa de todos os campos
            if (!objetivo || !equipamentos || !peso || !altura || !idade) {
                return res.status(400).json({ 
                    error: "Dados de usuário incompletos. Faltam objetivo, equipamentos, peso, altura ou idade." 
                });
            }

            // Gera um número único (timestamp) para forçar a variação na IA
            const variationSeed = Date.now();
            
            // ✍️ Prompt (Instrução) detalhada para a IA
            const prompt = `
                Você é um personal trainer especializado. Gere um plano de treino de musculação com exatamente 4 exercícios.
                
                O usuário tem o objetivo principal de ${objetivo}.
                O usuário tem ${idade} anos, pesa ${peso} kg e mede ${altura} cm.
                Ele tem acesso SOMENTE aos seguintes equipamentos: ${equipamentos.join(', ')}. Use apenas estes equipamentos,NÂO DEVE ser gerado um treino que utilize algum equipamento que está ausente nesta lista (se o usuário não tiver barra, ele não pode fazer supino, por exemplo).

                Elabore pesquisas na internet para saber como são feitos os treinos para realizar este filtro, cumprindo os requesitos pedidos
                
                Sempre que receber este prompt, gere um treino completamente novo e diferente. Variação ID: ${variationSeed}.

                Crie o treino em formato JSON ESTREITAMENTE, seguindo a estrutura abaixo.
                O objeto JSON FINAL DEVE ter apenas duas chaves, "treinoDoDia" e "exercicios".
                
                Estrutura do JSON:
                {
                    "treinoDoDia": "Nome do Grupo Muscular Focado (Somente esses grupos são disponíveis: Pernas, Ombros, Costas, Peito, Biceps e Triceps, como no exemplo: 

 pernas: [
    { equipamento: "Halteres", exercicio: "Agachamento leve", foco: ["Resistência", "Funcional"] },
    { equipamento: "Halteres", exercicio: "Passada (avanço)", foco: ["Crescimento", "Força"] },
    { equipamento: "Barra", exercicio: "Agachamento livre pesado", foco: ["Força", "Crescimento"] }
],


  ombros: [
    { equipamento: "Halteres", exercicio: "Elevação lateral sentada", foco: ["Resistência", "Crescimento"] },
    { equipamento: "Halteres", exercicio: "Desenvolvimento militar", foco: ["Crescimento", "Força"] },
    { equipamento: "Barra", exercicio: "Desenvolvimento em pé", foco: ["Força", "Crescimento"] }
],)",
                    "exercicios": [
                        { "nome": "Nome do Exercício", "series": N, "repeticoes": N, "equipamento": "Nome do Equipamento Usado" },
                        { "nome": "Nome do Exercício", "series": N, "repeticoes": N, "equipamento": "Nome do Equipamento Usado" },
                        { "nome": "Nome do Exercício", "series": N, "repeticoes": N, "equipamento": "Nome do Equipamento Usado" },
                        { "nome": "Nome do Exercício", "series": N, "repeticoes": N, "equipamento": "Nome do Equipamento Usado" },
                        { "nome": "Nome do Exercício", "series": N, "repeticoes": N, "equipamento": "Nome do Equipamento Usado" },
                        { "nome": "Nome do Exercício", "series": N, "repeticoes": N, "equipamento": "Nome do Equipamento Usado" },
                        { "nome": "Nome do Exercício", "series": N, "repeticoes": N, "equipamento": "Nome do Equipamento Usado" },
                        { "nome": "Nome do Exercício", "series": N, "repeticoes": N, "equipamento": "Nome do Equipamento Usado" }
                    ]
                }
                Não inclua qualquer texto introdutório, conclusivo ou explicações.
            `;

            // 📞 Chamada à API da OpenAI
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "Você é um gerador de treino especializado em formato JSON." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.8, // Mantemos a temperatura para encorajar a variação
                response_format: { type: "json_object" } 
            });

            // Processamento da resposta
            const rawResponseText = response.choices[0].message.content;
            const cleanJsonString = rawResponseText.replace(/```json|```/g, '').trim();
            const treinoData = JSON.parse(cleanJsonString); 

            // Retorna o JSON do treino
            res.json(treinoData);

        } catch (error) {
            console.error("🔴 Erro na API da OpenAI ou ao processar JSON:", error.message);
            res.status(500).json({ 
                error: "Falha ao gerar treino com OpenAI.", 
                details: error.message 
            });
        }
    });

    // ======================================
    // 🚀 INICIALIZA O SERVIDOR
    // ======================================
    app.listen(port, () => {
        console.log(`Servidor de IA (OpenAI) rodando em http://localhost:${port}`);
    });