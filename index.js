// CONFIG EXPRESS
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cors())

//CORS DISABLE
//app.use((req, res, next) => {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//
//    if (req.method === 'OPTIONS') {
//        res.header('Acess-Control-Allow-Methods', 'PUT, POST, PATCH DELETE, GET');
//        return res.status(200).json({})
//    }
//    next();
//});

//CONFIG GOOGLE-SPREADSHEET CORS DISABLE
const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet('1f7UznepF4rX43WDiYfUXHnpKqEs5w_fVOuu1IZhEO8M');

//CONTROLLER FUNÇÃO BUSCA
const accessSheet = async () => {
    await doc.useServiceAccountAuth(require('./credentials'));
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[13]
    //console.log(sheet)
    return await sheet.getRows();

}

//FUNÇÃO DE BUSCA
app.get('/list/tasks', function (req, res, next) {
    accessSheet().then(rows => {
        
        const arr = []

        rows.forEach(row => {
            let ticket = {
                id: row.id,
                data: row.data,
                titulo: row.titulo,
                equipe: row.equipe,
                local: row.local,
                cidade: row.cidade,
                status: row.status
            }

            if(row.status != 'Concluído' && row.status != null && row.status != 'Cancelado' && row.status != 'Paralisado'){
                

                arr.push(ticket);

            }
            

        })
        
        res.json(arr);
    })

})

//Encerramento de ticket

app.post('/close/task', function (req, res, next) {
    accessSheet().then(rows => {
        
        const ticket = [];

        rows.forEach(row => {
            ticket.push(row)
            
        })
        
        ticket[0].save();
    })
    console.log('ok')
    return res.status(200).send(req.params.id);
    
})

let server = app.listen(3000);
console.log('Servidor Express iniciado na porta %s', server.address().port);