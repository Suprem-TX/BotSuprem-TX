const fs = require('fs');
const path = require('path');
const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');  // Importa LocalAuth
const sharp = require('sharp');
const qrcode = require('qrcode-terminal');
const axios = require('axios'); // Para hacer solicitudes HTTP


const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
});

client.on('qr', (qr) => {
    console.log('Escanea este código QR para iniciar sesión:');
    const qrcode = require('qrcode-terminal');
    qrcode.generate(qr, { small: true });
});


// Evento que se ejecuta cuando el bot se conecta y está listo
client.on('ready', async () => {
    console.log('✅ Bot de WhatsApp está listo y conectado!');
});

client.on('group_join', async (notification) => {
    try {
        const chat = await client.getChatById(notification.chatId);
        
        // Verificar si el chat tiene el nombre
        if (!chat || !chat.name) {
            throw new Error('No se pudo obtener el nombre del grupo.');
        }

        const groupName = chat.name; // Nombre del grupo

        const welcomeMessage = `     |㊙️𝐒𝐮𝐩𝐫𝐞𝐦𝐓𝐗 - 𝐁𝐎𝐓㊙️|
╭✯───────•••───────✯
├❝  𝙱𝚒𝚎𝚗𝚟𝚎𝚗𝚒𝚍𝚘 𝚄𝚜𝚞𝚊𝚛𝚒𝚘  ❞
├─────────•••─────────
├📍 ✯ 𝙸𝚗𝚏𝚘𝚛𝚖𝚊𝚌𝚒𝚘𝚗 ✯ 📍
├ 𝙽𝚘𝚖𝚋𝚛𝚎  
├ @${notification.recipientIds[0].split('@')[0]}!
├ 𝙶𝚛𝚞𝚙𝚘 
├ ${groupName}
╰✯───────•••───────✯
`;

        const imagePath = '/root/BotSuprem-TX/img/bienvenida.jpg';  // Imagen de bienvenida
        const welcomeImage = await MessageMedia.fromFilePath(imagePath);

        // Enviar el mensaje con la imagen y el texto
        await client.sendMessage(notification.chatId, welcomeMessage, { 
            mentions: notification.recipientIds,
            media: welcomeImage // Enviar la imagen
        });

    } catch (error) {
        console.error('Error al obtener info del grupo:', error.message);
    }
});


// Manejo de eventos para participantes que se van
client.on('group_leave', async (notification) => {
    const farewellMessage = `* 𝙷𝚊𝚜𝚝𝚊 𝚕𝚞𝚎𝚐𝚘 👋
╭✯───────•••───────✯
├ 𝙽𝚘𝚖𝚋𝚛𝚎 ☛ 
├@${notification.recipientIds[0].split('@')[0]}
╰✯───────•••───────✯`;

    // Ruta de la imagen de fondo de despedida
    const imagePath = '/root/BotSuprem-TX/img/despedida.jpg';  // Cambia a la ruta de tu imagen de fondo de despedida

    try {
        // Cargar la imagen de despedida
        const farewellImage = await MessageMedia.fromFilePath(imagePath);

        // Enviar la imagen y el texto juntos en un solo mensaje
        await client.sendMessage(notification.chatId, farewellMessage, { 
            mentions: notification.recipientIds,
            media: farewellImage // Enviar la imagen
        });
    } catch (error) {
        console.error('Error al crear la imagen con texto:', error);
        await client.sendMessage(notification.chatId, '');
    }
});

client.on('message', async (message) => {
    try {
        // Verifica si el mensaje proviene de un grupo
        if (!message.from.includes('@g.us')) {
            return; // Ignora los mensajes que no sean de grupos
        }

        // Expresión regular para detectar enlaces
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        // Verifica si el mensaje contiene un enlace
        if (urlRegex.test(message.body)) {
            // Obtén el chat del mensaje
            const chat = await message.getChat();

            console.log(`Mensaje con enlace detectado en el grupo: ${chat.name}`);

            // Notifica al grupo que los enlaces están restringidos
            await chat.sendMessage(
                `*|㊙️𝐒𝐮𝐩𝐫𝐞𝐦𝐓𝐗 - 𝐁𝐎𝐓㊙️|*\n\n\🚫 *Enlaces no permitidos* 🚫\n@${message.author.split('@')[0]}, los enlaces están prohibidos en este grupo.`,
                { mentions: [message.author] }
            );

            // Intenta eliminar el mensaje si el bot es administrador
            try {
                await message.delete(true); // Elimina el mensaje para todos
                console.log("Mensaje eliminado correctamente.");
            } catch (error) {
                console.log("No se pudo eliminar el mensaje (¿El bot no es administrador?).");
            }
        }
    } catch (error) {
    }
});

client.on('message', async (message) => {
    // Verifica si el mensaje es de un grupo
    if (!message.from.includes('@g.us')) {
        return; // Ignora los mensajes que no sean de grupos
    }

    // Verifica si el mensaje es de un grupo
    if (!message.from.includes('@g.us')) {
        return; // Ignora los mensajes que no sean de grupos
    }



    if (message.body.startsWith('.menu')) {
        const infoText = `|㊙️𝐒𝐮𝐩𝐫𝐞𝐦𝐓𝐗 - 𝐁𝐎𝐓㊙️|
╭✯───────•••───────✯
├❝  𝙸𝚗𝚏𝚘𝚛𝚖𝚊𝚌𝚒𝚘𝚗 𝚍𝚎𝚕 𝙱𝚘𝚝  ❞
├─────────•••─────────
├📌  𝙲𝚘𝚖𝚊𝚗𝚍𝚘𝚜  📌
├ .𝚜𝚎𝚛𝚟𝚎𝚛  
├ .𝚜
├ .𝚋𝚒𝚗
├ .𝚓𝚙𝚐
├✯───────•••───────✯
├𝙴𝚜𝚝𝚎 𝙱𝚘𝚝 𝚋𝚘𝚛𝚛𝚊 𝚌𝚞𝚊𝚕𝚚𝚞𝚒𝚎𝚛 𝚕𝚒𝚗𝚔
╰✯───────•••───────✯`;
    
        const media = MessageMedia.fromFilePath('/root/BotSuprem-TX/img/menu.png');
        await client.sendMessage(message.from, media, { caption: infoText });
    }
    
    if (message.body.startsWith('.info')) {
        const infoText = `📑𝙸𝚗𝚏𝚘𝚛𝚖𝚊𝚌𝚒𝚘𝚗 𝙳𝚎𝚕 𝙲𝚛𝚎𝚊𝚍𝚘𝚛📑
╭✯───────•••───────✯
├ 𝚈𝚘𝚞𝚃𝚞𝚋𝚎 ☛ 
├https://www.youtube.com/@SupremTX9
├ 𝙶𝚒𝚝𝙷𝚞𝚋 ☛ 
├ https://github.com/Suprem-TX
├ 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 ☛
├ wa.me/4791791766
├ 𝚃𝚎𝚕𝚎𝚐𝚛𝚊𝚖 ☛
├ t.me/SupremTX1
╰✯───────•••───────✯`;
    
        const media = MessageMedia.fromFilePath('/root/BotSuprem-TX/img/info.png');
        await client.sendMessage(message.from, media, { caption: infoText });
    }
    
    const msg = message.body.toLowerCase();
    // Comando .s (convertir imagen en sticker)
    if (msg === '.s') {
        try {
            let targetMessage = null;

            // Verificar si se está respondiendo a un mensaje
            if (message.hasQuotedMsg) {
                targetMessage = await message.getQuotedMessage();
            } else if (message.hasMedia) {
                targetMessage = message;
            }

            // Verificar si el mensaje tiene medios (imagen)
            if (targetMessage && targetMessage.hasMedia) {
                const media = await targetMessage.downloadMedia(); // Descarga la imagen

                if (media && media.mimetype.startsWith('image')) {
                    const imageBuffer = Buffer.from(media.data, 'base64');
                    const copyrightText = ""; // Texto de copyright

                    // Procesar la imagen y generar el sticker
                    const stickerBuffer = await sharp(imageBuffer)
                        .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                        .webp({ quality: 80 })
                        .toBuffer();

                    // Crear metadata para el sticker
                    const sticker = new MessageMedia('image/webp', stickerBuffer.toString('base64'));

                    // Enviar la imagen como sticker
                    await client.sendMessage(message.from, sticker, {
                        sendMediaAsSticker: true,
                        stickerName: "㊙️𝐒𝐮𝐩𝐫𝐞𝐦𝐓𝐗 - 𝐁𝐎𝐓㊙️",
                        stickerAuthor: copyrightText
                    });
                } else {
                }
            } else {
            }
        } catch (error) {
            console.error(':', error);
            await message.reply('');
        }
    }
    // Comando .jpg (convertir sticker en imagen)
    if (msg === '.jpg') {
        let targetMessage = null;

        // Verificar si se está respondiendo a un mensaje
        if (message.hasQuotedMsg) {
            targetMessage = await message.getQuotedMessage();
        } else if (message.hasMedia) {
            targetMessage = message;
        }

        if (targetMessage && targetMessage.hasMedia) {
            const media = await targetMessage.downloadMedia(); // Descarga el sticker

            if (media && media.mimetype.startsWith('image/webp')) {
                const imageBuffer = Buffer.from(media.data, 'base64');
                const copyrightText = "🉐𝐒𝐮𝐩𝐫𝐞𝐦 𝐓𝐗🉐"; // Texto de copyright

                // Procesar la imagen y convertirla en formato JPG
                const jpgBuffer = await sharp(imageBuffer)
                    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                    .jpeg({ quality: 80 })
                    .toBuffer();

                // Crear metadata para la imagen en JPG
                const image = new MessageMedia('image/jpeg', jpgBuffer.toString('base64'), 'image.jpg');

                // Enviar la imagen JPG al chat
                await client.sendMessage(message.from, image, { caption: '' });
            } else {
            }
        } else {
        }
    }



    if (message.body.startsWith('.servers')) {
        const directoryPath = '/root/BotSuprem-TX/serv/';
        try {
            const files = fs.readdirSync(directoryPath);
            
            if (files.length === 0) {
                await message.reply('📂 La carpeta está vacía.');
                return;
            }
    
            // Ruta o URL de la imagen que deseas enviar
            const imagePath = '/root/SupremBot/img/serv.png';  // Cambia esta ruta con la correcta
            const media = MessageMedia.fromFilePath(imagePath);
    
            // Envía el mensaje junto con la imagen
            await client.sendMessage(message.from, media, { caption: `*Archivos enviandos`});
            
            for (const file of files) {
                const filePath = path.join(directoryPath, file);
    
                // Asegúrate de que sea un archivo
                if (fs.lstatSync(filePath).isFile()) {
                    try {
                        const mediaFile = MessageMedia.fromFilePath(filePath);
                        await client.sendMessage(message.from, mediaFile, { caption: `📄 Archivo: ${file}` });
                    } catch (err) {
                        console.error(`Error al enviar el archivo ${file}:`, err);
                        await message.reply(`❌ No se pudo enviar el archivo: ${file}`);
                    }
                }
            }
        } catch (error) {
        }
    }

// Función para generar un número de tarjeta válido con Luhn
function generateCard() {
    const binList = ['417849001', '417849001']; // Lista de BINs válidos
    const bin = binList[Math.floor(Math.random() * binList.length)];
    let cardNumber = bin;

    // Generamos 9 dígitos aleatorios (para completar 15 sin contar el check digit)
    while (cardNumber.length < 15) {
        cardNumber += Math.floor(Math.random() * 10);
    }

    // Cálculo del dígito de verificación (check digit) para cumplir con Luhn
    let sum = 0;
    let shouldDouble = true;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i), 10);
        if (shouldDouble) {
            digit *= 2;
            digit = (digit > 9) ? digit - 9 : digit;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }

    let checkDigit = (10 - (sum % 10)) % 10;
    cardNumber += checkDigit;

    return cardNumber;
}

// Función para generar una fecha de expiración aleatoria (MM/YY)
function generateExpDate() {
    const now = new Date();
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const year = String(now.getFullYear() + Math.floor(Math.random() * 4) + 2).slice(-2);
    return `${month}/${year}`;
}

// Función para generar un código CCV aleatorio (3 dígitos)
function generateCCV() {
    return String(Math.floor(100 + Math.random() * 900)); // Rango: 100-999
}

// Lista de BINs válidos
const validBins = ['417849001', '417849001']; 

// Función para verificar si el BIN corresponde a un emisor real
function isRealBin(bin) {
    return validBins.includes(bin);
}

// Función para calcular la probabilidad de que la tarjeta sea usable
function calculateProbability(card) {
    return isRealBin(card.substring(0, 6)) ? 90 : 50;
}

// Comprobación del comando
if (message.body.startsWith('.live')) {
    try {
        const card = generateCard(); // Genera la tarjeta
        const expDate = generateExpDate(); // Genera fecha de expiración
        const ccv = generateCCV(); // Genera el CCV
        const probability = calculateProbability(card); // Calcula probabilidad

        await message.reply(`🎫 Tarjeta generada: ${card}\n📅 Exp: ${expDate}  🔑 CCV: ${ccv}\n⚡ Probabilidad de live: ${probability}%`);
    } catch (error) {
        console.error('Error al generar tarjeta:', error);
        await message.reply('❌ Ocurrió un error al generar la tarjeta.');
    }
}

if (message.body.startsWith('.apks')) {
    try {
        // Rutas de los archivos (Cambia estas rutas con las correctas)
        const xapkPath = '/root/SupremBot/apps/DarkTunnel_SSH-TUNNEL.xapk';
        const apkPath = '/root/SupremBot/apps/ZArchiver.apk';

        // Verifica si los archivos existen antes de enviarlos
        if (!fs.existsSync(xapkPath) || !fs.existsSync(apkPath)) {
            await message.reply('❌ No se encontraron los archivos. Verifica las rutas.');
            return;
        }

        // Enviar el archivo .xapk con su descripción
        const xapkMedia = MessageMedia.fromFilePath(xapkPath);
        await client.sendMessage(message.from, xapkMedia, { 
            caption: `> 📦App para los servidores`
        });

        // Enviar el archivo .apk con su descripción
        const apkMedia = MessageMedia.fromFilePath(apkPath);
        await client.sendMessage(message.from, apkMedia, { 
            caption: `> Aplicacion para instalar la app DarkTunnel`
        });

    } catch (error) {
        console.error('Error al enviar las apps:', error);
        await message.reply('❌ Ocurrió un error al intentar enviar las aplicaciones.');
    }
}


// COMANDO GEN BIN
if (msg.startsWith('.gen')) {
    const _0xabc123 = msg.split(' ')[1];
    if (!_0xabc123) return message.reply(atob('PiDwn46hwqkgKkZvcm1hdG8gaW5jb3JyZWN0bw=='));

    const _0xdef456 = _0xabc123.replace(/[^0-9xX|rndRND]/g, '');
    const _0xghi789 = _0xdef456.match(/^([\dXx]{6,16})(?:\|(\d{2}|rnd))?(?:\|(\d{4}|rnd))?(?:\|(\d{3}|rnd)?)?$/i);
    if (!_0xghi789) return message.reply(atob('PiDwn46hwqkgKkZvcm1hdG8gaW5jb3JyZWN0bw=='));

    const [_, _0xjkl012, _0xlmn345, _0xopq678, _0xrst901] = _0xghi789;
    const _0xuvw234 = (max, pad = 0) => String(Math.floor(Math.random() * max) + pad).padStart(2, '0');
    const _0xyz567 = Array.from({ length: 5 }, () => {
        const _0xbin = _0xjkl012.replace(/[xX]/g, () => Math.floor(Math.random() * 10));
        return `${_0xbin}|${_0xlmn345?.toLowerCase() === 'rnd' ? _0xuvw234(12, 1) : _0xlmn345 || _0xuvw234(12, 1)}|${_0xopq678?.toLowerCase() === 'rnd' ? _0xuvw234(5, 2025) : _0xopq678 || _0xuvw234(5, 2025)}|${_0xrst901?.toLowerCase() === 'rnd' ? _0xuvw234(900, 100) : _0xrst901 || _0xuvw234(900, 100)}`;
    });

    let _0xbankInfo = atob('SW5mb3JtYWNpw7NuIGRlbCBiYW5jbyBubyBkaXNwb25pYmxl');
    try {
        const { data } = await axios.get(`https://lookup.binlist.net/${_0xjkl012.slice(0, 6)}`);
        _0xbankInfo = `${atob('8J+No8Kgwqogwq5CYW5jbyDigJY=')}${data.bank?.name || atob('RGVzY29ub2NpZG8=')}\n${atob('8J+UtSDCoCBQYWlzIOKAlg==')}${data.country?.name || atob('RGVzY29ub2NpZG8=')}`;
    } catch (error) {
        console.error(atob('RXJyb3IgYWwgb2J0ZW5lciBsYSBpbmZvcm1hY2nDs24gZGVsIEJJTjo='), error);
    }

    message.reply(`${atob('PiDwn46hwqkgxIfwn5iBIMKjIEdlbmVyYWNpw7NuIEV4aXRvc2Eg4oCmIPCfmoE=')}\n${_0xyz567.map((bin, i) => `${i + 1}. ${bin}`).join('\n')}\n\n${atob('PiDwn4iDIEJJTiAoKQ==')}${_0xjkl012.slice(0, 6)}\n\n${_0xbankInfo}`);
}

function luhnCheck(_0xnum) {
    let _0xsum = 0, _0xflag = false;
    for (let i = _0xnum.length - 1; i >= 0; i--) {
        let _0xdigit = parseInt(_0xnum.charAt(i), 10);
        if (_0xflag) {
            _0xdigit *= 2;
            _0xdigit = (_0xdigit > 9) ? _0xdigit - 9 : _0xdigit;
        }
        _0xsum += _0xdigit;
        _0xflag = !_0xflag;
    }
    return _0xsum % 10 === 0;
}
// COMANDO CHECK LIVE|

});

client.initialize();
