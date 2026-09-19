// Função para trocar de subpáginas sem atualizar a página
function navegarPara(idPagina) {
    const paginas = document.querySelectorAll('.subpagina');
    paginas.forEach(pagina => pagina.classList.remove('ativa'));

    const paginaAlvo = document.getElementById(idPagina);
    if (paginaAlvo) {
        paginaAlvo.classList.add('ativa');
    }
}

// Configuração do Webhook do Discord
const DISCORD_WEBHOOK_URL = "https://discordapp.com/api/webhooks/1550619147904491620/cHRYMnO-JXztk-RxCMSPU__j8bF9BGxigu93f8QDhWyJOuML_SORN9AwDnHBtuWc--1m";

const form = document.getElementById('formFeedback');
const lista = document.getElementById('listaFeedbacks');

// Função para renderizar os feedbacks na tela
function carregarFeedbacks() {
    const salvos = JSON.parse(localStorage.getItem('feedbacks_verano')) || [];
    lista.innerHTML = '';

    salvos.forEach(item => {
        const card = document.createElement('div');
        card.className = 'feedback-card';
        card.innerHTML = `
            <div class="feedback-header">
                <strong class="feedback-name">${item.nome}</strong>
                <span class="feedback-date">${item.data}</span>
            </div>
            <p class="feedback-text">"${item.mensagem}"</p>
        `;
        lista.appendChild(card);
    });
}

// Evento ao enviar o formulário de feedback
form?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const nomeInput = document.getElementById('nome').value;
    const mensagemInput = document.getElementById('mensagem').value;
    const dataHoje = new Date().toLocaleDateString('pt-BR');

    // 1. Salvar localmente
    const novoFeedback = {
        nome: nomeInput,
        mensagem: mensagemInput,
        data: dataHoje
    };

    const salvos = JSON.parse(localStorage.getItem('feedbacks_verano')) || [];
    salvos.unshift(novoFeedback);
    localStorage.setItem('feedbacks_verano', JSON.stringify(salvos));

    // 2. Enviar notificação para o Webhook do Discord
    const payload = {
        username: "Sistema de Feedbacks - Victor Verano",
        embeds: [
            {
                title: "⭐ Novo Feedback Recebido!",
                fields: [
                    { name: "Cliente / Empresa", value: nomeInput, inline: true },
                    { name: "Data", value: dataHoje, inline: true },
                    { name: "Depoimento", value: mensagemInput }
                ],
                color: 12597547, // Cor vermelha correspondente
                footer: {
                    text: "Dr. Victor Verano Advocacia"
                },
                timestamp: new Date().toISOString()
            }
        ]
    };

    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (err) {
        console.error('Erro ao enviar feedback para o Discord:', err);
    }

    form.reset();
    carregarFeedbacks();
    alert('Obrigado pelo seu feedback! Ele foi publicado com sucesso.');
});

// Inicialização
carregarFeedbacks();