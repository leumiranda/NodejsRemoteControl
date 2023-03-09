const mqtt = require('mqtt');
const { exec } = require('child_process');
const screenshot = require('screenshot-desktop');

const brokerUrl = 'mqtt://test.mosquitto.org';
const supportTopic = 'suporte';

const client = mqtt.connect(brokerUrl);

client.on('connect', function () {
  console.log('Conectado ao broker MQTT');

  client.subscribe(supportTopic, function (err) {
    if (err) {
      console.error('Erro ao se inscrever no tópico', supportTopic, err);
      return;
    }
    console.log('Inscrito no tópico', supportTopic);
  });
});

client.on('message', function (topic, message) {
  if (topic !== supportTopic) {
    console.warn('Mensagem recebida em um tópico desconhecido', topic, message.toString());
    return;
  }

  const command = message.toString();
  switch (command) {
    case 'reiniciar':
      executeCommand('shutdown /r', 'Reiniciando o sistema...');
      break;
    case 'notepad':
      executeCommand(process.platform === 'win32' ? 'notepad' : 'gedit', 'Abrindo o bloco de notas...');
      break;
    case 'calc':
      executeCommand(process.platform === 'win32' ? 'calc' : 'gnome-calculator', 'Abrindo a calculadora...');
      break;
    case 'browser':
      openBrowser('http://www.example.com');
      break;
    case 'print':
      screenshot({ format: 'png' }).then((img) => {
        require('fs').writeFileSync('screenshot.png', img);
        console.log('Screenshot saved!');
    }).catch((err) => {
        console.error(err);
    });
      //uploadToDrive();
      break;
    default:
      console.warn('Comando desconhecido', command);
  }
});

function executeCommand(command, message) {
  console.log(message);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao executar o comando: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Erro ao executar o comando: ${stderr}`);
      return;
    }
    console.log(`Comando executado com sucesso: ${stdout}`);
  });
}

function openBrowser(url) {
  switch (process.platform) {
    case 'win32':
      exec(`start "" "${url}"`);
      console.log('Abrindo a URL...')
      break;
    case 'darwin':
      exec(`open "${url}"`);
      break;
    default:
      exec(`xdg-open "${url}"`);
  }
}

function uploadToDrive() {
  const { google } = require('googleapis');
  const fs = require('fs');
  const path = require('path');
  const TOKEN_PATH = 'token.json';
  const CREDENTIALS_PATH = 'credentials.json';
  const FILENAME = 'print.png';
  const FOLDER_ID = '<ID_DA_PASTA_NO_GOOGLE_DRIVE>';

  fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) {
      console.log('Erro ao carregar as credenciais do Google Drive:', err);
      return;
    }
    const credentials = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) {
        console.log('Erro ao carregar o token do Google Drive:', err);
        return;
      }
      oAuth2Client.setCredentials(JSON.parse(token));

      const drive = google.drive({ version: 'v3', auth: oAuth2Client });

      const fileMetadata = {
        name: FILENAME,
        parents: [FOLDER_ID]
      };

      const filePath = path.join(__dirname, FILENAME);
      const fileContent = fs.readFileSync(filePath);

      const media = {
        mimeType: 'image/png',
        body: fileContent
      };

      drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
      }, function (err, file) {
        if (err) {
          console.log('Erro ao enviar o print para o Google Drive:', err);
          return;
        }
        console.log('Print enviado para o Google Drive com sucesso. ID do arquivo:', file.data.id);
      });
    });
  });
}
