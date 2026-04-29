# AUTOGET

Sistema de gestão para oficina mecânica desenvolvido com `Expo`, `React Native` e `TypeScript`, com foco em operação diária, organização visual e demonstração de fluxo completo de atendimento.

## Visão geral

O `AUTOGET` simula o funcionamento de uma oficina moderna em uma única aplicação. O projeto foi estruturado para rodar em `web`, `android` e `ios`, usando dados locais com persistência no navegador para facilitar demonstração, testes visuais e evolução futura para backend real.

Hoje o sistema já cobre:

- tela de apresentação com CTA de login, cadastro e contato via WhatsApp;
- autenticação demonstrativa;
- dashboard com métricas e notificações acionáveis;
- gestão de clientes;
- gestão de veículos;
- ordens de serviço;
- agendamentos;
- controle de estoque;
- financeiro;
- persistência local de estado na web.

## Tecnologias

- `Expo`
- `React Native`
- `React Navigation`
- `TypeScript`
- `React Native Web`
- `PDFKit` para geração da documentação em PDF

## Principais funcionalidades

### Fluxo inicial

- `IntroScreen`: landing page com carrossel, serviços, depoimentos e botão flutuante do WhatsApp.
- `LoginScreen`: acesso demonstrativo ao sistema.
- `RegisterScreen`: tela de cadastro simulada.

### Módulos de negócio

- `Dashboard`: indicadores operacionais, financeiros e notificações de agendamento.
- `Clientes`: cadastro, edição, busca e exclusão.
- `Veículos`: associação com clientes e controle de dados do veículo.
- `OS`: criação de ordens, mudança de status e cálculo de itens.
- `Agendamentos`: controle cronológico dos atendimentos.
- `Estoque`: gerenciamento de peças e alerta visual de estoque baixo.
- `Financeiro`: receitas, despesas, saldo e filtros por transação.

### Recursos técnicos já implementados

- estado global centralizado com `Context` + `Reducer`;
- persistência local com `localStorage` na versão web;
- tema claro/escuro centralizado;
- componentes reutilizáveis para layout, botões, inputs, cards e badges de status;
- menu hambúrguer compartilhado entre as telas principais;
- documentação técnica em `Markdown`, `HTML` e `PDF`.

## Estrutura do projeto

```text
OficinaPro/
├── App.tsx
├── package.json
├── docs/
│   ├── SISTEMA_AUTOGET.md
│   ├── SISTEMA_AUTOGET.html
│   ├── SISTEMA_AUTOGET.pdf
│   └── generate-doc-pdf.js
└── src/
	├── components/
	├── context/
	├── navigation/
	├── screens/
	├── types/
	└── utils/
```

## Arquitetura resumida

### `App.tsx`

Controla o fluxo principal entre intro, login, cadastro e aplicação autenticada. Também salva o estado de interface para manter a experiência consistente na web.

### `src/context/AppContext.tsx`

É o núcleo do sistema. Centraliza as coleções principais:

- clientes;
- veículos;
- ordens de serviço;
- agendamentos;
- peças;
- transações financeiras.

Além disso, expõe as ações de criação, edição, remoção e atualização consumidas pelas telas.

### `src/navigation/MainTabs.tsx`

Organiza as abas principais visíveis do app:

- `Dashboard`
- `Clientes`
- `OS`
- `Financeiro`

### `src/components`

Contém os blocos reutilizáveis de interface, como:

- `Screen`
- `Card`
- `Button`
- `Input`
- `StatusBadge`
- `AppMenuButton`

## Pré-requisitos

- `Node.js` LTS
- `npm`
- Expo via `npx`

## Instalação

No `PowerShell`:

```powershell
Set-Location "C:\Users\liopo\Desktop\Teste-main\OficinaPro"
npm install
```

## Execução

### Ambiente padrão

```powershell
npm start
```

### Web

```powershell
npm run web
```

### Android

```powershell
npm run android
```

### iOS

```powershell
npm run ios
```

## Documentação técnica gerada

O projeto já possui uma documentação completa do sistema em três formatos:

- `docs/SISTEMA_AUTOGET.md`
- `docs/SISTEMA_AUTOGET.html`
- `docs/SISTEMA_AUTOGET.pdf`

Para regenerar o PDF:

```powershell
npm run docs:pdf
```

## Persistência de dados

Na versão web, o aplicativo salva informações no `localStorage` usando os utilitários em `src/utils/storage.ts`.

Chaves atualmente utilizadas:

- `autoget:ui-state`
- `autoget:data-state`

Isso permite manter o estado da interface e os dados simulados entre recarregamentos do navegador.

## Observações importantes

- a autenticação atual é demonstrativa;
- os dados ainda não vêm de uma API real;
- o projeto está pronto para futura integração com backend;
- algumas telas existem no código mesmo quando não estão nas abas principais.

## Próximos passos sugeridos

- integrar backend real (`Supabase`, `Firebase` ou API própria);
- implementar autenticação real com perfis;
- expandir relatórios e exportações;
- adicionar testes automatizados;
- configurar lint, formatação e CI.

## Repositório

Repositório informado no histórico do projeto:

- `https://github.com/Shicknovz/oficinaGET`

## Licença

Este projeto está em desenvolvimento e pode ser adaptado conforme a necessidade da oficina ou da equipe responsável.
