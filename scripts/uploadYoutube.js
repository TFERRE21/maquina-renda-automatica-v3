const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];
const TOKEN_PATH = 'token.json';

async function authorize() {
  const credentials = JSON.parse(fs.readFileSync('credentials.json'));
  const { client_secret, client_id, redirect_uris } = credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    'urn:ietf:wg:oauth:2.0:oob'
  );

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('\n🔗 Abra este link no navegador:\n');
  console.log(authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('\n📌 Cole aqui o código gerado pelo Google: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Erro ao obter token', err);
      oAuth2Client.setCredentials(token);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
      console.log('✅ Token salvo com sucesso!');
      uploadVideo(oAuth2Client);
    });
  });
}

async function uploadVideo(auth) {
  const youtube = google.youtube({ version: 'v3', auth });

  const request = {
    part: 'snippet,status',
    requestBody: {
      snippet: {
        title: 'Teste Automático',
        description: 'Upload automático via bot 🤖',
      },
      status: {
        privacyStatus: 'private',
      },
    },
    media: {
      body: fs.createReadStream('output/video-final.mp4'),
    },
  };

  const response = await youtube.videos.insert(request);
  console.log('🎉 Vídeo enviado com sucesso!');
}

authorize();