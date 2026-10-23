# 🧸 Say Kids — Sistema de Gestão Escolar de Educação Infantil

Projeto acadêmico do curso de **Análise e Desenvolvimento de Sistemas (ADS)** — disciplina de Projeto de Sistemas.
Sistema web completo para a gestão de uma escola de educação infantil (creche/pré-escola),
com controle de alunos, turmas, agenda diária, cardápio, estoque, frequência por QR Code e emissão de documentos.

## 🌐 Acesso online (sistema hospedado)

**https://say-kids-eight.vercel.app**

> O sistema está hospedado na **Vercel** e usa um banco de dados **online (Supabase)**,
> então os dados ficam salvos e compartilhados entre todos os dispositivos (PC e celular).

## ✨ Funcionalidades por perfil

O sistema possui **7 perfis de acesso**, cada um com suas telas e permissões:

| Perfil | O que faz |
|---|---|
| **Administrador** | Cadastra secretarias, colaboradores, professores e turmas; gerencia usuários; vê o histórico de movimentações. |
| **Secretaria** | Cadastra alunos, responsáveis, colaboradores, professores e turmas; emite documentos; cadastra cardápio; consulta restrições alimentares. |
| **Professor** | Preenche a agenda diária (alimentação, sono, atividades e observações); vê suas turmas e alunos; recebe recados dos responsáveis. |
| **Auxiliar** | Preenche a agenda (alimentação e sono) das turmas em que atua; recebe recados. |
| **Porteiro** | Registra a **entrada e saída** dos alunos lendo o **QR Code** (câmera) ou pela busca manual. |
| **Almoxarife** | Controla o estoque, registra movimentações, gera lista de compras e consulta o cardápio. |
| **Responsável** | Acompanha o(s) filho(s): frequência, alimentação, sono, atividades, observações, cardápio; edita a foto e envia recados. |

### Destaques
- 📷 **Frequência por QR Code** — cada aluno tem uma tag de QR Code (imprimível) que o porteiro lê pela câmera para registrar entrada/saída.
- 🍎 **Cardápio com verificação de restrições** — o sistema bloqueia o cardápio se houver aluno com restrição a algum alimento, e gera lista de compras quando falta estoque.
- 📄 **Emissão de documentos** — modelos com campos preenchidos automaticamente, editor com formatação, logo e assinatura.
- 🔔 **Notificações** — avisos de entrada/saída para os responsáveis, recados, etc.
- 📱 **Responsivo** — funciona no computador e no celular.

## 🔑 Acessos de teste

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | admin@saykids.com | admin123 |
| Secretaria | marina@saykids.com | secretaria123 |
| Professor | juliana@saykids.com | professor123 |
| Auxiliar | ana@saykids.com | auxiliar123 |
| Porteiro | roberto@saykids.com | porteiro123 |
| Almoxarife | marcia@saykids.com | almoxarife123 |
| Responsável | carla@email.com | responsavel123 |

## 🛠️ Tecnologias

- **Front-end:** HTML, CSS e JavaScript puro (sem frameworks de build).
- **Banco de dados:** [Supabase](https://supabase.com) (PostgreSQL online), acessado direto do navegador via API.
- **Hospedagem:** [Vercel](https://vercel.com) (deploy automático a cada push).
- **Leitura/geração de QR Code:** bibliotecas `qrcodejs` e `jsQR`.
- **Testes automatizados:** [Jest](https://jestjs.io).

## ▶️ Como executar

### Online
Basta acessar o link: **https://say-kids-eight.vercel.app**

### Localmente
1. Baixe/clone o repositório.
2. Abra o arquivo `index.html` no navegador.

> Observação: para usar a **câmera** do porteiro, o sistema precisa rodar em `https` (como no link da Vercel) ou em `localhost` — por segurança, os navegadores não liberam a câmera ao abrir o arquivo direto (`file://`).

## 🧪 Testes automatizados

O projeto tem testes automatizados com **Jest**, cobrindo o login e as regras de negócio
(turmas, restrições alimentares, estoque e recados).

```bash
npm install   # só na primeira vez
npm test
```

## 📁 Estrutura do projeto

```
say-kids/
├── index.html          # Tela de login
├── painel.html         # Painel do sistema (todas as telas)
├── css/                # Estilos (style.css = login, painel.css = painel)
├── js/
│   ├── login.js        # Autenticação e usuários de teste
│   ├── painel.js       # Lógica de todas as telas do sistema
│   ├── regras.js       # Regras de negócio (testáveis)
│   └── db-bridge.js    # Ponte com o banco de dados (Supabase)
├── testes/             # Testes automatizados (Jest)
└── assets/             # Imagens
```

## 👩‍💻 Autora

**Yasmim Sayuri Anami de Assis**
Curso de Análise e Desenvolvimento de Sistemas.
