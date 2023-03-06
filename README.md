# NodeRemoteControl

*Como utilizar:*

**Passo 1**: Clone o repositório do projeto:
git clone https://github.com/seu-usuario/node-remote.git

**Passo 2**: Instale as dependências do projeto:
npm install

**Passo 3**: Compile o executável do "deviceB" com o pkg:
pkg package.json

**Passo 4**: Copie o executável "deviceB" gerado para a pasta de inicialização do Windows:
cp deviceB.exe "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

**Passo 5**: Execute o "deviceA" para se conectar ao "deviceB":
node deviceA.js

*Exemplos de como o aplicativo pode ajudar em suporte de TI:*

O cliente não consegue abrir um aplicativo, mas com o controle remoto é possível acessar o computador do cliente e abrir o aplicativo para ele.

Problemas de configuração podem ser facilmente resolvidos através do controle remoto, permitindo que o suporte acesse o computador do cliente e ajuste as configurações necessárias.

O cliente pode precisar de ajuda para atualizar um software, e com o controle remoto é possível fazer isso de forma rápida e eficiente, sem que o cliente precise realizar nenhuma ação manualmente.
