# AUTOGET

Sistema de gestão para oficina mecânica desenvolvido com `Expo`, `React Native`, `TypeScript` e `Expo Router`.

## Destaques do projeto

- autenticação demonstrativa com fluxo de `Intro`, `Login`, `Cadastro` e recuperação de senha;
- navegação organizada com `Expo Router` e abas principais;
- módulos de `Clientes`, `Veículos`, `OS`, `Agendamentos`, `Estoque` e `Financeiro`;
- componentização com `Button`, `Input`, `Card`, `Screen`, `ModalShell` e outros componentes reutilizáveis;
- gerenciamento de estado com `Context` e persistência local na web;
- tema centralizado e interface responsiva para apresentação profissional.

## Tecnologias

- `Expo SDK 54`
- `React Native`
- `TypeScript`
- `Expo Router`
- `React Navigation`
- `React Native Web`

## Estrutura principal

```text
OficinaPro/
├── app/
│   ├── _layout.tsx
│   ├── IntroScreen/
│   ├── LoginScreen/
│   ├── CadastroScreen/
│   ├── ForgotPasswordScreen/
│   ├── ChangePasswordScreen/
│   ├── VeiculosScreen/
│   ├── AgendamentoScreen/
│   ├── EstoqueScreen/
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── HomeScreen/
│       ├── ClientesScreen/
│       ├── OSScreen/
│       └── FinanceiroScreen/
├── docs/
│   └── APRESENTACAO_PROJETO.md
├── src/
│   ├── components/
│   ├── context/
│   ├── screens/
│   ├── types/
│   └── utils/
├── app.json
├── App.tsx
├── package.json
└── tsconfig.json
```

## Como executar

### Instalar dependências

```powershell
npm install
```

### Rodar em desenvolvimento

```powershell
npm start
```

### Usar no iPhone com Expo Go

No `Windows`, o simulador iOS do Xcode não está disponível. Mesmo assim, você pode testar no iPhone físico com `Expo Go`:

```powershell
npm run ios:device
```

Depois, abra o app `Expo Go` no iPhone e escaneie o QR Code gerado no terminal.

### Gerar build iOS em nuvem

Para gerar um build iOS sem macOS local, use o `EAS Build`:

```powershell
npm run ios:build
```

Para build de produção:

```powershell
npm run ios:build:prod
```

Na primeira execução, o Expo pode pedir login e configuração do projeto no `EAS`.

### Rodar no Android com Android Studio

Use o `Android Studio` apenas para iniciar o emulador, depois rode o app pelo Expo:

```powershell
npm run android
```

Se quiser gerar e compilar o projeto nativo Android localmente:

```powershell
npm run android:native
```

### Diagnóstico rápido

```powershell
npm run doctor
```

### Rodar na web

```powershell
npm run web
```

## Arquitetura resumida

- `app/_layout.tsx`: injeta `ThemeProvider`, `SessionProvider`, `AppProvider` e a pilha principal.
- `app/(tabs)/_layout.tsx`: organiza as abas principais com `Expo Router`.
- `src/context/AppContext.tsx`: centraliza dados de clientes, veículos, ordens, agendamentos, peças e transações.
- `src/context/SessionContext.tsx`: controla autenticação demonstrativa e persistência do fluxo inicial.
- `src/components`: reúne os componentes reutilizáveis do sistema.
- `src/screens`: concentra a lógica visual dos módulos de negócio.

## Rotas principais

- `/IntroScreen`
- `/LoginScreen`
- `/CadastroScreen`
- `/ForgotPasswordScreen`
- `/ChangePasswordScreen`
- `/(tabs)/HomeScreen`
- `/(tabs)/ClientesScreen`
- `/VeiculosScreen`
- `/(tabs)/OSScreen`
- `/AgendamentoScreen`
- `/EstoqueScreen`
- `/(tabs)/FinanceiroScreen`

## Apresentação

O roteiro da apresentação está em `docs/APRESENTACAO_PROJETO.md`.

## Observação sobre Android Studio

- este projeto usa `Expo Router` no fluxo gerenciado do Expo;
- por isso, o `Android Studio` normalmente é usado para abrir o emulador Android;
- não é necessário abrir um projeto `android/` manualmente para testar no emulador;
- se você quiser um projeto nativo Android em pasta, use `npm run android:native`, que dispara o fluxo nativo local do Expo.

## Observação sobre iOS

- o projeto já está compatível com `iOS` no fluxo gerenciado do `Expo`;
- no `Windows`, você não consegue abrir o simulador do `Xcode` localmente;
- para teste local, use um `iPhone` com `Expo Go` e o comando `npm run ios:device`;
- para instalar em iPhone ou gerar `.ipa`, use `EAS Build` com `npm run ios:build`;
- o estado local do app hoje persiste totalmente na `web`; em `iOS` o app funciona, mas os dados demonstrativos reiniciam ao fechar/reabrir até que uma persistência nativa seja adicionada.
