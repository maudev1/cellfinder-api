const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(bodyParser.raw());

//CORS ALLOW
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if (req.method === 'OPTIONS') {
        res.header('Acess-Control-Allow-Methods', 'PUT, POST, PATCH DELETE, GET');
        return res.status(200).json({})
    }
    next();
});

//CONFIG GOOGLE-SPREADSHEET
const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet('1f7UznepF4rX43WDiYfUXHnpKqEs5w_fVOuu1IZhEO8M');

//CONTROLLER
const accessSheet = async () => {
    const response = {
        error: true,
        erroMessage: 'erro',
        content: null
    }

    try {

        await doc.useServiceAccountAuth(require('/home/mauricio/Área de Trabalho/credentials.json'));
        await doc.loadInfo();
        const sheet = doc.sheetsById[1060498837]
        //response.content = await sheet.getRows();
        const rows = await sheet.getRows();

        console.log(rows)

        for (item of rows) {
            ticket.length = null

            ticket.push({
                data: item.data,
                title: item.titulo,
                requester: item.solicitante,
                type: item.tipo,
                responsible: item.responsavel,
                coordinates: item.coordenadas,
                city: item.cidade,
                status: item.andamento
            })

        }

    }
    catch (err) {
        console.warn('Problemas ao conectar ao google spreadsheet!')

    }

}

const ticket = [];

//FUNÇÃO DE BUSCA
router.get('/', async (req, res, next) => {
    const response = await accessSheet(req);

    res.send(ticket)
    res.status(200).send(response);

    console.log(ticket)
});

module.exports = router;
