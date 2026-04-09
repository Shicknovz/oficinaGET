AUTOGET (Oficina)

Aplicativo de gestão para oficinas — ordens de serviço, agendamentos, estoque e financeiro.

Este repositório contém uma versão em desenvolvimento do aplicativo mobile `AUTOGET` (baseado em Expo / React Native).

## Status

- Tela de introdução (landing) com carrossel, serviços e depoimentos implementada.
- Fluxo básico: Intro -> Login -> Main Tabs.
- Projeto inicial importado e enviado para GitHub.

## Pré-requisitos

- Node.js (recomendo LTS >= 16)
- npm (ou yarn)
- Expo (usado via `npx expo`)

## Instalação e execução (desenvolvimento)

No PowerShell (Windows):

```powershell
cd C:\Users\liopo\Desktop\Teste-main\OficinaPro
npm install
npx expo start -c
```

Depois, abra o Expo DevTools, use um emulador ou escaneie o QR code com Expo Go (atenção à compatibilidade de SDK — algumas dependências mostram avisos durante o start). 

## Notas sobre imagens e conteúdo

- A tela de Introdução (`src/screens/IntroScreen.tsx`) atualmente usa imagens remotas (Unsplash) como placeholders.
- Para usar imagens locais, crie a pasta `assets/` na raiz do projeto e coloque arquivos como `assets/hero.jpg`, `assets/logo.png`, `assets/service-1.jpg`, etc. Em seguida, atualize os imports no `IntroScreen` para usar `require('../assets/hero.jpg')`.

Exemplo (local):

```tsx
// antes: source={{ uri: 'https://...' }}
// depois:
<Image source={require('../assets/hero.jpg')} />
```

## Persistência do Intro

Atualmente a tela Intro é controlada em memória (sempre aparece ao iniciar). Para mostrar apenas na primeira execução é recomendado salvar um flag com `@react-native-async-storage/async-storage` e ler antes de decidir exibir a tela.

## Testes e qualidade

- Não há testes automatizados no momento.
- Sugiro adicionar lint/format (ESLint/Prettier) e um CI básico (GitHub Actions) para validar builds e testes.

## Publicação / Builds nativos

- Para gerar builds nativos recomendo usar EAS Build da Expo (requer configuração de conta e credenciais iOS/Android).

## Push e histórico

- Este código foi inicializado localmente e empurrado para: `https://github.com/Shicknovz/oficinaGET`.

## Contribuição

1. Fork
2. Crie uma branch: `git checkout -b feat/nova-coisa`
3. Commit suas alterações: `git commit -m "feat: descreva a mudança"`
4. Abra um Pull Request

## Contato

Se quiser que eu inclua imagens locais, depoimentos reais, ou persista a dismissão do Intro, envie os arquivos e/ou textos e eu integro.

---
Projeto gerado e mantido localmente — personalize conforme necessário.
