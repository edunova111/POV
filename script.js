// Substitua pela URL do Web App gerada no Passo 1
const URL_API_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbx54nIhRdbavyYkTlN-O9pgsPcCNkB1QQ_lkn_AbPLo31k9UxwohWJIDGY7VI16Xp8ZxA/exec";

document.addEventListener("DOMContentLoaded", () => {
    carregarLinkAlbum();

    const form = document.getElementById("uploadForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nomeConvidado = document.getElementById("nomeConvidado").value;
        const fotoInput = document.getElementById("fotoInput");
        const btnEnviar = document.getElementById("btnEnviar");
        const statusDiv = document.getElementById("status");

        if (fotoInput.files.length === 0) return;

        const arquivo = fotoInput.files[0];
        btnEnviar.disabled = true;
        btnEnviar.textContent = "Enviando...";
        statusDiv.className = "hidden";

        try {
            const base64Data = await converterParaBase64(arquivo);

            const resposta = await fetch(URL_API_APPS_SCRIPT, {
                method: "POST",
                mode: "no-cors", // Necessário devido às políticas de redirecionamento do Google Apps Script
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    acao: "salvarFoto",
                    base64Data: base64Data,
                    fileName: arquivo.name,
                    nomeConvidado: nomeConvidado
                })
            });

            // Como usamos 'no-cors', não conseguimos ler a resposta detalhada diretamente, 
            // mas se não disparar erro de rede, o envio foi bem-sucedido.
            statusDiv.textContent = "Foto enviada com sucesso!";
            statusDiv.className = "sucesso";
            form.reset();
        } catch (erro) {
            statusDiv.textContent = "Erro ao enviar: " + erro.message;
            statusDiv.className = "erro";
        } finally {
            btnEnviar.disabled = false;
            btnEnviar.textContent = "Enviar Foto";
            statusDiv.classList.remove("hidden");
        }
    });
});

function converterParaBase64(arquivo) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (erro) => reject(erro);
        reader.readAsDataURL(arquivo);
    });
}

async function carregarLinkAlbum() {
    try {
        const resposta = await fetch(URL_API_APPS_SCRIPT, {
            method: "POST",
            body: JSON.stringify({ acao: "obterLink" })
        });
        const dados = await resposta.json();
        if (dados.sucesso) {
            const linkA = document.getElementById("linkAlbum");
            linkA.href = dados.url;
            linkA.classList.remove("hidden");
        }
    } catch (e) {
        console.log("Não foi possível carregar o link automático da pasta.");
    }
}