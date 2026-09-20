![image](./assets/images/splash-icon.png)

#

Uma solução mobile voltada para responsáveis por
crianças atípicas. O objetivo é transformar sinais da rotina coletados
por dispositivos vestíveis em informações simples e contextualizadas
para a família e para a próxima sessão terapêutica.

> 🌟 O contexto da semana chega antes da sessão.

## 📃 Contexto

Durante a rotina da criança, o DiaElo recebe sinais disponíveis por meio
de dispositivos vestíveis, como frequência cardíaca, RMSSD,
atividade/movimento e indicadores agregados de ativação.

A aplicação organiza esses dados por períodos do dia e apresenta
observações geradas pela API.

O responsável também poderá registrar acontecimentos importantes da
rotina. Em uma evolução futura, esses registros poderão ser relacionados
aos sinais coletados para construir um contexto semanal mais completo e
preparar o terapeuta para a sessão.

O produto não tem como objetivo diagnosticar emoções, crises ou
condições médicas. Os dados representam sinais fisiológicos e devem ser
utilizados como ponto de partida para observação e conversa com os
profissionais que acompanham a criança.

## ⚒️ Tecnologias

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Expo](https://img.shields.io/badge/expo-%231C1E24.svg?style=for-the-badge&logo=expo&logoColor=#D04A37) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Axios](https://img.shields.io/badge/axios-671ddf?&style=for-the-badge&logo=axios&logoColor=white)

![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)

## Requisitos

![NodeJS](https://img.shields.io/badge/node.js-%236DA55F.svg?style=for-the-badge&logo=node.js&logoColor=white) ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white) ![Yarn](https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white) ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)

#### Para iOS nativo

![macOS](https://img.shields.io/badge/mac%20os-%23000000.svg?style=for-the-badge&logo=macos&logoColor=F0F0F0&logoSize=auto) ![Xcode](https://img.shields.io/badge/Xcode-%23007ACC.svg?style=for-the-badge&logo=Xcode&logoColor=white)

#### Para Android nativo

![Android](https://img.shields.io/badge/Android-%233DDC84.svg?style=for-the-badge&logo=android&logoColor=white) ![Android Studio](https://img.shields.io/badge/Android%20Studio-%233DDC84.svg?style=for-the-badge&logo=android-studio&logoColor=white)

## 🎨 Design

Desenvolvido no [Figma Make](https://www.figma.com/make/BCzCk4IHDBePPq6rMiblNt/DiaElo-Mobile-App?code-node-id=0-6&p=f&t=lt5I49pEbRHAuOP4-0&fullscreen=1)

![imagem](assets/images/screenshot-simulator-hoje.png)

## Instalação

```bash
git clone https://github.com/AlvaroPereir4/Tech4Change-DiaElo-Grupo-09.git
cd Tech4Change-DiaElo-Grupo-09/mobile
yarn install
```

## 📱 Expo Go

Inicie o servidor:

```bash
npx expo start
```

Abra o projeto pelo QR Code usando o Expo Go.

Também é possível iniciar diretamente:

```bash
npx expo start --android
```

```bash
npx expo start --ios
```

## 📲 Development Build

O projeto possui `expo-dev-client`.

#### 🍏 Para criar e executar a versão nativa no iOS:

```bash
npx expo run:ios
```

#### 🤖 Para Android:

```bash
npx expo run:android
```

## 🔌 API

A API do DiaElo está hospedada em:

http://168.75.104.67:8000

A documentação Swagger/OpenAPI está disponível em:

http://168.75.104.67:8000/docs

A URL base deve ficar centralizada na configuração do projeto.

## Contrato de dados

Um exemplo de retorno dos dados pode ser encontrado em [/mocks](src/mock/index.json)

Quando `conclusive` for `false`, o frontend deve respeitar a ausência de
dados e não inventar valores.

## 🛡️ Princípios do frontend

Todos os valores exibidos devem ser derivados da API. O frontend não
deve criar números, datas, leituras, estados, observações ou insights
fictícios.

A interface deve diferenciar dados observados de interpretações e nunca
apresentar sinais fisiológicos como diagnóstico ou emoção detectada.

Preferir termos como:

- maior ativação
- dentro do padrão
- dados insuficientes
- observação
- ponto para conversar

## Fluxo do MVP

```text
Resumo do dia
      |
      v
Períodos do dia
      |
      v
Detalhes e observações
      |
      v
Contexto da semana
      |
      v
Sessão terapêutica
```

O registro de acontecimentos da família representa a próxima camada do
produto e permitirá relacionar contexto familiar e sinais da rotina.

## Status

Projeto em desenvolvimento e fase de MVP.

## Licença

[🪪 LICENSE](./LICENSE)
