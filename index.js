// CONFIG EXPRESS
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

//CORS DISABLE
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if (req.method === 'OPTIONS') {
        res.header('Acess-Control-Allow-Methods', 'PUT, POST, PATCH DELETE, GET');
        return res.status(200).json({})
    }
    next();
});

//CONFIG GOOGLE-SPREADSHEETORS DISABLE
const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet('1f7UznepF4rX43WDiYfUXHnpKqEs5w_fVOuu1IZhEO8M');

//CONTROLLER FUNÇÃO BUSCA
const accessSheet = async() =>{
    await doc.useServiceAccountAuth(require('./credentials'));
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[2]    
        return await sheet.getRows();

        }
        
//Função de busca
app.get('/service-order/find/all', function(req, res, next) {
    accessSheet().then(rows => {
        
        const arr = []
        rows.forEach(row =>{
            let ticket = {
                data: row.data,
                titulo: row.titulo,
                solicitante: row.solicitante,
                responsavel: row.responsavel,
                coordenadas: row.coordenadas,
                cidade: row.cidade,
                status: row.status
            }

            arr.push(ticket);
            
        })

        res.json(arr);
    })
    
});

//Abertura novo ticket

//Encerramento de ticket


let server = app.listen(3000);
console.log('Servidor Express iniciado na porta %s', server.address().port);