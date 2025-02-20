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
        const chat = await client.getChatById(notification.chatId); // Obtener el chat del grupo
        
        // Verificar si el chat tiene el nombre
        if (!chat || !chat.name) {
            throw new Error('No se pudo obtener el nombre del grupo.');
        }

        const groupName = chat.name; // Nombre del grupo

        // Mensaje de bienvenida
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

        // Imagen de bienvenida
        const imagePath = '/root/BotSuprem-TX/img/bienvenida.jpg';  // Ruta de la imagen
        const welcomeImage = await MessageMedia.fromFilePath(imagePath);

        // Enviar el mensaje con la imagen y el texto
        await client.sendMessage(notification.chatId, welcomeMessage, { 
            mentions: notification.recipientIds, // Mencionar al nuevo usuario
            media: welcomeImage // Enviar la imagen de bienvenida
        });

        // Obtener todos los participantes
        const participants = await client.getGroupMembers(notification.chatId); // Método actualizado

        if (!participants || participants.length === 0) {
            return client.sendMessage(notification.chatId, "❌ No se encontraron participantes.");
        }

        let mentions = [];
        let text = '👥 *Mencionando a todos:* \n';

        // Construir el texto con las menciones
        for (let participant of participants) {
            mentions.push(participant.id._serialized);  // Usar _serialized para la mención
            text += `@${participant.id.user} `;
        }

        // Enviar el mensaje mencionando a todos
        await client.sendMessage(notification.chatId, text, { mentions });

    } catch (error) {
        console.error('Error al obtener info del grupo:', error.message);
        client.sendMessage(notification.chatId, "❌ Ocurrió un error al intentar procesar el comando.");
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
├ .file (editable los archivos)
├ .𝚜
├ .gen
├ .𝚓𝚙𝚐
├ .live
├ .check
├✯───────•••───────✯
├𝙴𝚜𝚝𝚎 𝙱𝚘𝚝 𝚋𝚘𝚛𝚛𝚊 𝚌𝚞𝚊𝚕𝚚𝚞𝚒𝚎𝚛 𝚕𝚒𝚗𝚔
├ Siendo administrador
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
// COMANDO GEN BIN
if (msg.startsWith('.gen')) {
    const _0xabc123 = msg.split(' ')[1];
    if (!_0xabc123) return message.reply('> ⚠️ *Formato incorrecto*');

    const _0xdef456 = _0xabc123.replace(/[^0-9xX|rndRND]/g, '');
    const _0xghi789 = _0xdef456.match(/^([\dXx]{6,16})(?:\|(\d{2}|rnd))?(?:\|(\d{4}|rnd))?(?:\|(\d{3}|rnd)?)?$/i);
    if (!_0xghi789) return message.reply('> ⚠️ *Formato incorrecto*');

    const [_, _0xjkl012, _0xlmn345, _0xopq678, _0xrst901] = _0xghi789;
    const _0xuvw234 = (max, pad = 0) => String(Math.floor(Math.random() * max) + pad).padStart(2, '0');
    const _0xyz567 = Array.from({ length: 5 }, () => {
        const _0xbin = _0xjkl012.replace(/[xX]/g, () => Math.floor(Math.random() * 10));
        return `${_0xbin}|${_0xlmn345?.toLowerCase() === 'rnd' ? _0xuvw234(12, 1) : _0xlmn345 || _0xuvw234(12, 1)}|${_0xopq678?.toLowerCase() === 'rnd' ? _0xuvw234(5, 2025) : _0xopq678 || _0xuvw234(5, 2025)}|${_0xrst901?.toLowerCase() === 'rnd' ? _0xuvw234(900, 100) : _0xrst901 || _0xuvw234(900, 100)}`;
    });

    let _0xbankInfo = 'Información del banco no disponible';
    try {
        const { data } = await axios.get(`https://lookup.binlist.net/${_0xjkl012.slice(0, 6)}`);
        _0xbankInfo = `🏦 𝙱𝚊𝚗𝚌𝚘 ☛ ${data.bank?.name || 'Desconocido'}\n🏳️ 𝙿𝚊𝚒𝚜 ☛ ${data.country?.name || 'Desconocido'}`;
    } catch (error) {
        console.error('Error al obtener la información del BIN:', error);
    }

    message.reply(`> ✅ 𝙶𝚎𝚗𝚎𝚛𝚊𝚌𝚒𝚘𝚗 𝙴𝚡𝚒𝚝𝚘𝚜𝚊 ✅\n${_0xyz567.map((bin, i) => `${i + 1}. ${bin}`).join('\n')}\n\n> 💳 𝙱𝙸𝙽\n${_0xjkl012.slice(0, 6)}\n\n${_0xbankInfo}`);
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


    try {
        // Verifica si el mensaje es de un grupo
        if (!message.from.includes('@g.us')) {
            return; // Ignora los mensajes que no sean de grupos
        }

        const msg = message.body.toLowerCase();

        // Comando .file para enviar archivos .dark y .hc
        if (msg.startsWith('.file')) {
            // Define la ruta de la carpeta donde están los archivos
            const folderPath = '/root/BotSuprem-TX/serv';  // Ajusta la ruta según donde estén tus archivos

            // Lee el contenido de la carpeta
            fs.readdir(folderPath, async (err, files) => {
                if (err) {
                    console.error('Error al leer la carpeta:', err);
                    await message.reply('❌ Ocurrió un error al leer la carpeta.');
                    return;
                }

                // Filtra los archivos que tengan las extensiones .dark o .hc
                const filesToSend = files.filter(file => file.endsWith('.dark') || file.endsWith('.hc'));

                if (filesToSend.length === 0) {
                    await message.reply('🔴 No se encontraron archivos .dark o .hc en la carpeta.');
                    return;
                }

                // Enviar todos los archivos encontrados
                for (const file of filesToSend) {
                    const filePath = path.join(folderPath, file);
                    try {
                        const media = await MessageMedia.fromFilePath(filePath);
                        await client.sendMessage(message.from, media, { caption: `Aquí tienes el archivo: ${file}` });
                    } catch (error) {
                        console.error(`Error al enviar el archivo ${file}:`, error);
                        await message.reply(`❌ Ocurrió un error al enviar el archivo ${file}.`);
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error al procesar el comando:', error);
    }

//COMANDO DELETE
if (!message.from.includes('@g.us')) {
    return;
}
if (message.body.startsWith('.delete')) {
    try {
        if (message.hasQuotedMsg) {
            const quotedMessage = await message.getQuotedMessage();

            await quotedMessage.delete(true);
        } else {
        }
    } catch (error) {
    }
}

     // COMANDO CHECK
     if (msg.startsWith('.check')) {
         const bin = msg.split(' ')[1]; // Extraer BIN ingresado por el usuario
 
         if (!bin || bin.length < 6) {
             message.reply("> ⚠️ *Por favor, ingresa un BIN válido*");
             return;
         }
 
         // Realizar la solicitud a la API de binlist.io
         try {
             const response = await axios.get(`https://lookup.binlist.net/${bin}`);
 
             // Verifica si la respuesta contiene la información del BIN
             if (response.data && response.data.scheme) {
                 const data = response.data;
                 const cardInfo = `
 > ✅ *Detalles del BIN:*
 - **Banco/Marca**: ${data.scheme.toUpperCase()}
 - **Banco**: ${data.bank.name || 'N/A'}
 - **Tipo de tarjeta**: ${data.type || 'N/A'}
 - **Categoría**: ${data.category || 'N/A'}
 - **País**: ${data.country.name || 'N/A'}
 - **Ubicación**: ${data.country.alpha2 || 'N/A'}
 - **Ciudad**: ${data.bank.city || 'N/A'}
 `;
                 message.reply(cardInfo);
             } else {
                 message.reply("> ⚠️ *No se pudo encontrar información para este BIN*");
             }
         } catch (error) {
             console.error('Error al consultar BIN:', error);
             message.reply("> ⚠️ *Ocurrió un error al intentar verificar el BIN*");
         }
     }



     client.on('message', async (message) => {
         // Verifica si el mensaje es de un grupo
         if (!message.from.includes('@g.us')) {
             return; // Ignora los mensajes que no sean de grupos
         }
     
         // Comando para MediaFire
         if (message.body.startsWith('.mediafire')) {
             const link = message.body.split(' ')[1]; // Obtener el enlace de MediaFire desde el mensaje
             if (!link) {
                 client.sendMessage(message.from, "Por favor, ingresa un enlace de MediaFire.");
                 return;
             }
     
             try {
                 // Aquí utilizamos los datos proporcionados en el JSON para simular la API
                 const data = {
                     "creator": "darlingg",
                     "status": true,
                     "folder": "4zhvcue3l75xa",
                     "data": [
                         {
                             "filename": "118963055_376112626887969_4242661724965974580_n.jpg",
                             "size": "179502",
                             "mime": "image/jpeg",
                             "extension": "jpg",
                             "uploaded": "2024-03-27 15:55:54",
                             "link": "https://www.mediafire.com/file/vmnhppl99gxpzwr/118963055_376112626887969_4242661724965974580_n.jpg/file"
                         },
                         {
                             "filename": "327436145_878201643327862_1872278343618549299_n.jpg",
                             "size": "138986",
                             "mime": "image/jpeg",
                             "extension": "jpg",
                             "uploaded": "2024-03-27 15:55:52",
                             "link": "https://www.mediafire.com/file/cccg1bexyicup10/327436145_878201643327862_1872278343618549299_n.jpg/file"
                         },
                         {
                             "filename": "48733181_001_6239.jpg",
                             "size": "91663",
                             "mime": "image/jpeg",
                             "extension": "jpg",
                             "uploaded": "2024-03-27 15:00:47",
                             "link": "https://www.mediafire.com/file/ji5rb04lca9tpe7/48733181_001_6239.jpg/file"
                         },
                         // Más archivos aquí...
                     ]
                 };
     
                 if (!data.status) {
                     client.sendMessage(message.from, 'La API está inactiva. Intenta más tarde.');
                     return;
                 }
     
                 const files = data.data; // Accede a los archivos en el campo "data"
                 if (!files || files.length === 0) {
                     client.sendMessage(message.from, 'No se encontraron archivos disponibles.');
                     return;
                 }
     
                 let fileLinks = 'Enlaces de MediaFire disponibles:\n';
     
                 // Itera sobre los archivos y extrae los enlaces
                 files.forEach(file => {
                     fileLinks += `${file.filename}: ${file.link}\n`;
                 });
     
                 // Enviar los enlaces como respuesta
                 client.sendMessage(message.from, fileLinks);
     
                 // Ahora, descargamos los archivos directamente desde los enlaces y los enviamos al grupo
                 for (const file of files) {
                     const fileUrl = file.link;
                     const fileName = file.filename;
                     
                     // Descarga el archivo
                     const response = await axios.get(fileUrl, {
                         responseType: 'arraybuffer'
                     });
     
                     // Guarda el archivo en el sistema temporalmente
                     const tempFilePath = path.join(__dirname, fileName);
                     fs.writeFileSync(tempFilePath, response.data);
     
                     // Envía el archivo al grupo
                     await client.sendMessage(message.from, fs.readFileSync(tempFilePath), { caption: fileName });
     
                     // Elimina el archivo temporal después de enviarlo
                     fs.unlinkSync(tempFilePath);
                 }
     
             } catch (error) {
                 console.error('Error al obtener archivos de MediaFire:', error);
                 client.sendMessage(message.from, 'Hubo un error al obtener los archivos de MediaFire.');
             }
         }
     });
     
     // Inicia sesión en WhatsApp
     client.initialize();
     
});
client.initialize();
