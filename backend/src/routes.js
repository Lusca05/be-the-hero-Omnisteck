const express = require('express');
const {celebrate, Segments, Joi} = require('celebrate');

const OngController = require('./controllers/ONGController');
const IncidentController = require('./controllers/IncidentController');
const ProfileController = require('./controllers/ProfileController');
const SessionController = require('./controllers/SessionController.js');
const routes = express.Router();

/**
 * Post para faser login mandando o id e retornando o nome da ONG
 */
routes.post('/sessions', SessionController.create);
/**
 * get para retornar as ongs existentes
 */
routes.get('/ongs', OngController.index );
/**
 * 
 * post para criar novas ongs
 * dentro do body precisa passado:
 *  nome(string)
 *  email(string: type email)
 *  whatsapp(int: tendo tamanho de no minimo 10 e maximo 11)
 *  city(string)
 *  uf(string: tamanho 2)
 * fazendo verificaçao se esses dados vieram
 */
routes.post('/ongs',celebrate({

    [Segments.BODY]:Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required().min(10).max(11),
        city: Joi.string().required(),
        uf: Joi.string().required().length(2)
    })

}), OngController.create);

/**
 * get para retornar a partir do id passado no header os casos registrados da ONG 
 * verificando se o header veio com o id
 * id:(string)
 */
routes.get('/profile', celebrate({
    [Segments.HEADERS]:Joi.object({
        authorization: Joi.string().required(),
    }).unknown(),
}), ProfileController.index);

/**
 * post para criaçao do incidente
 * passado no header o id da ong para que adicione na ong certa,
 * tendo que ser prenchidos o title a description e o value
 * value é numerico
 * verificando caso todos venham preenchidos
 */
routes.post('/incidents', celebrate({
    [Segments.HEADERS]:Joi.object({
        authorization: Joi.string().required(),
    }).unknown(),
    [Segments.BODY]:Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        value: Joi.number().required(),
    })
}),IncidentController.create);


/**
 * get para listar todos os incidents cadastrados 
 * verificando se o page for passadoele sera numerico
 * retornando erro caso nao seja
 */
routes.get('/incidents', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number(),
    }),
}),IncidentController.index);

/**
 * deletando um imcidente
 *  vendo se o header foi passado;
 * caso o id passado nao seja um numero ele dara erro 
 */

routes.delete('/incidents/:id', celebrate({
    [Segments.HEADERS]:Joi.object({
        authorization: Joi.string().required(),
    }).unknown(),
    [Segments.PARAMS]:Joi.object().keys({
        id: Joi.number().required(),
    })
}), IncidentController.delete);

module.exports = routes;