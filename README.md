cat > README.md <<'EOF'
# 👑 Baile Real — Câmera Digital da Rainha Ilda

<div align="center">

📸 **Uma câmera descartável digital para eternizar momentos especiais**

✨ Desenvolvido para o aniversário de 80 anos da Rainha Ilda ✨

</div>

---

# 📖 Sobre o Projeto

O **Baile Real** é uma experiência interativa criada para eventos, onde os convidados podem registrar seus próprios momentos através de uma câmera digital personalizada.

A proposta é transformar cada convidado em um fotógrafo da festa, permitindo que fotos sejam enviadas diretamente para um álbum compartilhado no Google Drive.

Uma releitura moderna das antigas câmeras descartáveis de festas, unindo:

- 📷 Facilidade de uso
- 📱 Compatibilidade com celulares
- ☁️ Armazenamento automático
- 👑 Experiência personalizada

---

# ✨ Funcionalidades

## 📸 Captura de Fotos

Os convidados podem:

- Tirar fotos usando a câmera do celular
- Escolher imagens da galeria
- Visualizar uma prévia antes do envio


## 🖼️ Compressão Automática

Antes do envio:

- A imagem é redimensionada automaticamente
- O tamanho é reduzido
- O carregamento fica mais rápido
- Mantém boa qualidade visual


## ☁️ Envio para Google Drive

As fotos são enviadas automaticamente para uma pasta do Google Drive.

Estrutura:

```

Álbum Baile Real

├── Foto_001.jpg
├── Foto_002.jpg
│
└── Nome do Convidado
├── Foto_003.jpg
└── Foto_004.jpg

```


## 👤 Identificação Opcional

O convidado pode informar:

- Nome
- Família
- Grupo de amigos

Caso preenchido, uma pasta personalizada é criada automaticamente.


## 🎞️ Álbum da Festa

Após enviar a foto, o convidado pode acessar o álbum completo da celebração.

---

# 🏗️ Tecnologias Utilizadas

## Front-end

- HTML5
- CSS3
- JavaScript
- Font Awesome
- SweetAlert2


## Back-end

- Google Apps Script
- Google Drive
- ContentService


## Hospedagem

- GitHub Pages

---

# 📂 Estrutura do Projeto

```

Baile-Real/

├── index.html
├── style.css
├── script.js
└── README.md

```

---

# ⚙️ Configuração

## 1. Criar pasta no Google Drive

Crie uma pasta para armazenar as fotos.

Copie o ID da pasta.

Exemplo:

```

[https://drive.google.com/drive/folders/SEU_ID](https://drive.google.com/drive/folders/SEU_ID)

```


---

## 2. Configurar Google Apps Script

Acesse:

```

[https://script.google.com](https://script.google.com)

```

Crie um projeto.

Cole o arquivo:

```

Code.gs

````

Configure:

```javascript
const CONFIG = {
  ID_PASTA_ALBUM:"SEU_ID_DA_PASTA"
};
````

Depois publique:

```
Implantar
↓
Nova implantação
↓
Aplicativo da Web
```

Configuração:

```
Executar como:
Seu usuário

Quem tem acesso:
Qualquer pessoa
```

Copie a URL gerada.

---

# 🔗 Configurar Front-end

No arquivo:

```
script.js
```

alterar:

```javascript
const URL_API =
"URL_DO_SEU_APPS_SCRIPT";
```

Coloque a URL do Web App.

---

# 🌐 Publicar no GitHub Pages

No GitHub:

```
Settings
↓
Pages
↓
Deploy from branch
```

Escolha:

```
main
/
root
```

Após salvar, o GitHub fornecerá a URL pública.

---

# 📱 Compatibilidade

Compatível com:

✅ Android
✅ iPhone
✅ Tablets
✅ Computadores

Navegadores recomendados:

* Chrome
* Safari
* Edge
* Firefox

---

# 🎨 Identidade Visual

Inspirado em:

👑 Realeza
📷 Câmeras clássicas
✨ Festas elegantes

Paleta:

| Cor        | Aplicação |
| ---------- | --------- |
| 🟨 Dourado | Destaques |
| ⚫ Preto    | Câmera    |
| ⚪ Branco   | Interface |
| 🩶 Cinza   | Textos    |

---

# 🔒 Privacidade

As fotos são armazenadas diretamente no Google Drive do organizador.

Nenhuma imagem é enviada para serviços externos.

O controle do álbum permanece com o responsável pelo evento.

---

# 🚀 Melhorias Futuras

Possíveis evoluções:

* 📸 Filtros de câmera
* 🖼️ Molduras personalizadas
* 🎉 Página de agradecimento
* ❤️ Sistema de favoritos
* 📱 Aplicativo próprio
* 🤖 Organização inteligente das fotos

---

# 👑 Créditos

Projeto criado especialmente para:

## Baile Real — 80 Anos Rainha Ilda

Uma experiência digital para guardar memórias de uma noite inesquecível.

---

<div align="center">

✨ Cada clique conta uma história. ✨

</div>

EOF
