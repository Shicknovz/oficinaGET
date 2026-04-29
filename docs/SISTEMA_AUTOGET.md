# Documentação Técnica do Sistema AUTOGET

Data: 29/04/2026
Projeto: `OficinaPro`
Stack principal: `Expo` + `React Native` + `TypeScript` + `React Navigation`

## 1. Visão geral

O AUTOGET é um sistema de gestão para oficina mecânica desenvolvido com Expo e React Native, preparado para execução em `web`, `android` e `ios`. Atualmente, o projeto funciona como uma aplicação de demonstração com dados locais em memória e persistência no navegador via `localStorage`.

O sistema foi estruturado para simular um fluxo completo de operação de oficina:
- apresentação institucional e entrada no sistema;
- autenticação demonstrativa;
- dashboard com métricas;
- gestão de clientes;
- gestão de veículos;
- ordens de serviço;
- agendamentos;
- estoque de peças;
- financeiro;
- notificações operacionais.

Mesmo sem backend real, a arquitetura foi montada de forma que a troca para API futura seja viável, porque os dados já estão centralizados em contexto e reducer.

## 2. Estrutura geral do projeto

### Arquivo raiz

- `App.tsx`: ponto de entrada do aplicativo. Controla fluxo entre intro, login, cadastro e aplicação principal.
- `package.json`: define scripts Expo e dependências.
- `tsconfig.json`: configuração TypeScript.

### Pasta `src`

- `components/`: componentes reutilizáveis de UI.
- `context/`: contextos globais de tema, dados e menu.
- `navigation/`: navegação principal por abas.
- `screens/`: telas do sistema.
- `types/`: contratos de dados TypeScript.
- `utils/`: funções auxiliares e persistência.

## 3. Stack e decisões técnicas

### 3.1 Expo + React Native

O projeto usa Expo para acelerar desenvolvimento multiplataforma. Isso simplifica execução local, navegação, build web e uso de componentes React Native em diferentes plataformas.

### 3.2 TypeScript

O TypeScript garante contratos claros para entidades importantes do sistema:
- `Cliente`
- `Veiculo`
- `OrdemServico`
- `ItemOS`
- `Agendamento`
- `Peca`
- `TransacaoFinanceira`

Isso reduz erros, melhora autocomplete e torna as regras do domínio mais explícitas.

### 3.3 Estado global com Context + Reducer

O núcleo de dados fica em `src/context/AppContext.tsx`. Em vez de espalhar estados por várias telas, o projeto concentra as coleções principais em um reducer. Essa escolha melhora:
- previsibilidade;
- reaproveitamento;
- persistência;
- evolução futura para backend.

### 3.4 Persistência local no navegador

O utilitário `src/utils/storage.ts` encapsula leitura e escrita em `localStorage`, apenas quando a plataforma é `web`. Isso evita falhas nas versões nativas e cria uma experiência mais estável em ambiente web.

## 4. Fluxo principal do aplicativo

## 4.1 Inicialização

Em `App.tsx`, o app lê o estado de interface salvo em `autoget:ui-state`.

Esse estado contém:
- `loggedIn`
- `showIntro`
- `showRegister`

A partir disso, o app decide qual tela mostrar:
1. se `loggedIn` for verdadeiro, abre `MainTabs`;
2. se `showRegister` for verdadeiro, abre `RegisterScreen`;
3. se `showIntro` for verdadeiro, abre `IntroScreen`;
4. caso contrário, abre `LoginScreen`.

Essa ordem é importante para evitar conflitos de navegação. Uma correção recente foi justamente priorizar `showRegister` antes de `showIntro`, porque o botão de cadastro estava preso na tela de apresentação.

## 4.2 Autenticação demonstrativa

### `LoginScreen.tsx`

A tela de login usa estado local para `email`, `senha` e `loading`.

Lógica principal:
- o botão `Entrar` ativa `loading`;
- após um `setTimeout`, chama `onLogin()`;
- na prática, isso simula autenticação;
- o botão `Cadastrar` chama `onRegister()`;
- o botão `Voltar` permite regressar à intro.

Na web, os campos ficam dentro de `<form>` para evitar alertas do navegador sobre campos de senha fora de formulários.

### `RegisterScreen.tsx`

A tela de cadastro segue a mesma abordagem do login:
- usa estado local para `name`, `email`, `senha` e `loading`;
- simula cadastro com `setTimeout`;
- chama `onRegister()` após a conclusão;
- também usa `<form>` na web.

### `IntroScreen.tsx`

A intro funciona como landing page institucional. Ela mistura:
- carrossel de imagens principal;
- apresentação visual da marca;
- CTA para entrar;
- CTA para cadastro;
- carrossel de serviços;
- depoimentos;
- endereço e contato;
- botão flutuante para WhatsApp.

Lógicas relevantes:
- dois `useEffect` fazem rotação automática dos carrosséis;
- o botão `Entrar` chama `onLogin`;
- o botão `Cadastrar-se` chama `onRegister`;
- o botão do WhatsApp tenta abrir o app nativo e, se falhar, usa URL web.

## 5. Tema e identidade visual

### `ThemeContext.tsx`

O sistema usa `useColorScheme()` para detectar tema claro/escuro do dispositivo e injeta o objeto de tema pelo contexto.

### `utils/theme.ts`

Define duas paletas:
- `themes.dark`
- `themes.light`

Essas paletas concentram:
- cor de fundo;
- cartões;
- bordas;
- textos;
- cores semânticas como `success`, `warning`, `danger`, `info`.

Essa abordagem evita hardcode espalhado e padroniza o visual do app.

## 6. Dados centrais do sistema

### `types/index.ts`

Esse arquivo define o domínio do sistema.

#### `Cliente`
Representa o dono do veículo.

#### `Veiculo`
Relaciona veículo a um cliente por `clienteId`.

#### `OrdemServico`
Representa o processo técnico de manutenção ou reparo.

Campos importantes:
- `status`
- `descricaoProblema`
- `itens`
- `valorTotal`
- `valorPago`
- `mecanicoResponsavel`

#### `Agendamento`
Representa compromissos de atendimento.

Status atuais:
- `confirmado`
- `pendente`
- `em_servico`
- `pronto`
- `cancelado`

Esses estados permitem usar o módulo de notificações como uma fila operacional.

#### `Peca`
Representa item de estoque.

#### `TransacaoFinanceira`
Representa movimentações financeiras, com tipo e status.

## 7. Gerenciamento global de dados

### `AppContext.tsx`

Esse é o coração lógico do sistema.

Ele contém:
- dados mockados iniciais;
- reducer central;
- funções CRUD expostas por contexto;
- persistência do estado completo em `autoget:data-state`.

### 7.1 Dados mockados

O sistema inicia com coleções de exemplo:
- clientes;
- veículos;
- ordens de serviço;
- agendamentos;
- peças;
- transações.

Isso permite demonstrar o app sem backend.

### 7.2 Reducer

O reducer trata ações como:
- adicionar, atualizar e remover clientes;
- adicionar, atualizar e remover veículos;
- adicionar e atualizar ordens de serviço;
- adicionar, atualizar e remover agendamentos;
- adicionar, atualizar e ajustar peças;
- adicionar transações.

### 7.3 Geração de IDs

Para entidades comuns, o ID é gerado com base em data atual + aleatoriedade.

Para ordens de serviço, a lógica cria IDs no formato:
- `OS-001`
- `OS-002`
- `OS-003`

### 7.4 Persistência

Sempre que o `state` muda, ele é salvo em `localStorage`.

Isso faz com que:
- alterações persistam na web;
- o usuário não tenha sensação de reinício a cada refresh;
- as telas reflitam mudanças em tempo real.

## 8. Navegação principal

### `navigation/MainTabs.tsx`

A navegação principal usa `createBottomTabNavigator`.

As abas ativas hoje são:
- `Dashboard`
- `Clientes`
- `OS`
- `Financeiro`

A interface das abas foi customizada com:
- ícone e label desenhados manualmente;
- destaque visual na aba selecionada;
- tab bar inferior com altura maior e sombra.

Uma correção importante feita anteriormente foi remover um `tabBarButton` customizado que estava interferindo na navegação e fazendo todas as abas voltarem ao dashboard.

## 9. Menu global

### `context/AppMenuContext.tsx`

Esse contexto injeta apenas uma responsabilidade global: `onLogout`.

### `components/AppMenuButton.tsx`

Componente do menu hambúrguer.

Responsabilidades:
- abrir modal de menu;
- navegar para rotas principais;
- executar logout.

Rotas disponíveis no menu:
- `Dashboard`
- `Clientes`
- `OS`
- `Financeiro`

## 10. Componentes reutilizáveis

### `components/Screen.tsx`

É o layout-base de praticamente todas as telas.

Funções:
- aplica `SafeAreaView`;
- aplica largura máxima centralizada;
- permite telas com `scroll` ou sem `scroll`;
- injeta o botão de menu automaticamente quando o contexto de menu existe.

Essa separação resolveu problemas de rolagem em telas baseadas em `FlatList`.

### `components/Card.tsx`

Cartão visual reutilizável.

Características:
- usa tema atual;
- aceita `onPress` opcional;
- aplica sombra adaptada para web e mobile.

### `components/Button.tsx`

Botão reutilizável com variantes:
- `primary`
- `success`
- `danger`
- `outline`

Também suporta:
- `icon`
- `loading`
- `disabled`
- `fullWidth`
- `size="small"`

### `components/Input.tsx`

Input reutilizável com:
- label opcional;
- mensagem de erro opcional;
- destaque visual no foco;
- tratamento visual diferente para web e mobile.

### `components/StatusBadge.tsx`

Responsável por mostrar o status padronizado de entidades.

Hoje cobre estados de:
- ordens de serviço;
- agendamentos;
- financeiro.

Isso centraliza cor, rótulo e estilo sem duplicar regras nas telas.

## 11. Utilitários

### `utils/helpers.ts`

Fornece funções puras para:
- formatar moeda em `pt-BR`;
- formatar data;
- formatar data e hora;
- formatar telefone.

### `utils/storage.ts`

Faz leitura e escrita seguras em `localStorage` apenas na web.

Proteções aplicadas:
- verifica plataforma;
- verifica se `localStorage` existe;
- usa `try/catch` para não quebrar a aplicação.

## 12. Explicação das telas de negócio

### 12.1 `DashboardScreen.tsx`

É a tela de visão executiva do sistema.

#### Dados exibidos
- total de clientes;
- total de veículos;
- OS abertas;
- OS em andamento;
- OS concluídas;
- peças com estoque baixo;
- receitas;
- despesas;
- saldo líquido;
- pendências financeiras;
- ticket médio;
- ordens recentes.

#### Lógicas importantes
- usa filtros em arrays para contar e consolidar dados;
- calcula ticket médio com média do valor total das OS;
- calcula saldo financeiro com `receitas - despesas`;
- monta lista de OS recentes ordenando por `dataEntrada`.

#### Notificações
O dashboard também concentra a lógica de notificações.

As notificações são derivadas dos `agendamentos` com status:
- `confirmado`
- `pendente`

Ao abrir o modal de notificações, o usuário vê cartões acionáveis com botões:
- `Pronto`
- `Em serviço`
- `Cancelado`

Ao clicar:
- o status do agendamento é alterado via `updateAgendamento`;
- a notificação some automaticamente da lista;
- o badge do sino é atualizado.

Isso cria a impressão de um painel operacional ativo, mesmo sem backend real.

### 12.2 `ClientesScreen.tsx`

Responsável pelo CRUD de clientes.

#### Lógicas usadas
- busca por nome ou CPF;
- modal para adicionar ou editar;
- exclusão direta por botão de lixeira;
- contagem dinâmica de veículos por cliente.

A tela usa `FlatList` com botão flutuante de criação.

### 12.3 `VeiculosScreen.tsx`

Responsável pelo CRUD de veículos.

#### Lógicas usadas
- busca por marca, modelo ou placa;
- associação com cliente por `clienteId`;
- adição e edição via modal;
- exclusão direta.

### 12.4 `OSScreen.tsx`

É um dos módulos mais importantes do sistema.

#### Funções principais
- filtrar ordens por status;
- abrir detalhe da OS;
- alterar status;
- criar nova OS;
- adicionar itens à OS;
- recalcular total.

#### Regras de negócio internas
- nova OS nasce com status `aberta`;
- total é recalculado com base nos itens;
- status podem transitar por opções pré-definidas;
- detalhe da OS relaciona cliente e veículo.

### 12.5 `AgendamentoScreen.tsx`

Gerencia compromissos de atendimento.

#### Lógicas usadas
- ordenação cronológica por `dataHora`;
- cadastro de agendamento com data e hora;
- detalhe com cliente e veículo;
- alternância rápida entre `confirmado` e `pendente`;
- exclusão do agendamento.

Observação: esse módulo existe e está funcional no código, mesmo que não esteja hoje no conjunto visível de abas principais.

### 12.6 `EstoqueScreen.tsx`

Controla peças e níveis de estoque.

#### Lógicas usadas
- busca por nome e código;
- cadastro e edição de peças;
- ajuste rápido de quantidade com botões `+` e `-`;
- indicador visual para nível do estoque.

#### Regras visuais
- crítico quando quantidade é zero;
- baixo quando abaixo do estoque mínimo;
- normal quando acima do mínimo.

### 12.7 `FinanceiroScreen.tsx`

Controla transações financeiras.

#### Dados resumidos
- receitas;
- despesas;
- saldo.

#### Lógicas usadas
- filtros por tipo e pendência;
- cadastro de transações;
- escolha de método de pagamento;
- exibição com `StatusBadge`.

Novas transações criadas pelo modal entram como `pago` por padrão.

## 13. Padrões de implementação usados no sistema

### 13.1 Padrão de CRUD em modal

Várias telas seguem a mesma estratégia:
- estado local para abrir/fechar modal;
- estado local para formulário;
- se houver item em edição, atualiza;
- se não houver, cria novo registro.

Isso aparece em:
- clientes;
- veículos;
- estoque;
- financeiro;
- ordens de serviço;
- agendamentos.

### 13.2 Cálculos derivados com `useMemo`

Em listas filtradas e ordenadas, o sistema usa `useMemo` para evitar recomputações desnecessárias.

### 13.3 Contexto como fonte única de verdade

As telas não mantêm cópia permanente dos dados centrais. Elas consomem e alteram o contexto global.

### 13.4 UI preparada para web e mobile

O código contém vários ajustes por plataforma:
- `<form>` na web;
- `boxShadow` no lugar de `shadow*` quando necessário;
- uso de `Platform.OS` para adequação visual.

## 14. Arquivos principais e suas responsabilidades

- `App.tsx`: orquestra fluxo inicial e persistência da UI.
- `src/context/AppContext.tsx`: estado global do negócio.
- `src/context/ThemeContext.tsx`: tema claro/escuro.
- `src/context/AppMenuContext.tsx`: logout compartilhado.
- `src/navigation/MainTabs.tsx`: abas principais.
- `src/components/Screen.tsx`: layout padrão.
- `src/components/Card.tsx`: cartão reutilizável.
- `src/components/Button.tsx`: botão reutilizável.
- `src/components/Input.tsx`: input reutilizável.
- `src/components/StatusBadge.tsx`: badge de status.
- `src/components/AppMenuButton.tsx`: menu hambúrguer.
- `src/screens/IntroScreen.tsx`: tela institucional inicial.
- `src/screens/LoginScreen.tsx`: login demonstrativo.
- `src/screens/RegisterScreen.tsx`: cadastro demonstrativo.
- `src/screens/DashboardScreen.tsx`: visão executiva e notificações.
- `src/screens/ClientesScreen.tsx`: CRUD de clientes.
- `src/screens/VeiculosScreen.tsx`: CRUD de veículos.
- `src/screens/OSScreen.tsx`: gestão de ordens de serviço.
- `src/screens/AgendamentoScreen.tsx`: gestão de agenda.
- `src/screens/EstoqueScreen.tsx`: controle de peças.
- `src/screens/FinanceiroScreen.tsx`: controle financeiro.
- `src/utils/helpers.ts`: formatações.
- `src/utils/storage.ts`: persistência local.
- `src/types/index.ts`: contratos do domínio.

## 15. Limitações atuais

Hoje o sistema é uma demonstração funcional local. Isso significa:
- não há backend real;
- autenticação é simulada;
- não existe controle de perfis e permissões;
- dados não sincronizam entre dispositivos;
- algumas telas existem no código, mas não aparecem na navegação principal atual.

## 16. Evolução recomendada

Próximos passos naturais do projeto:
- integrar API REST ou Firebase/Supabase;
- transformar `AppContext` em camada de serviços;
- autenticação real com sessão e refresh token;
- filtros avançados e paginação;
- relatórios em PDF reais para clientes e oficina;
- envio de notificações reais por push, e-mail ou WhatsApp;
- controle de usuários por perfil.

## 17. Conclusão

O AUTOGET já está estruturado com uma base sólida para crescer. Mesmo sendo uma versão demonstrativa, o projeto foi organizado de forma profissional, com separação de responsabilidades, centralização de estado, componentes reutilizáveis, tema consistente, persistência local e módulos claros por área da oficina.

A lógica atual já permite demonstrar um fluxo operacional completo e serve como fundação para evolução para um sistema de produção.
