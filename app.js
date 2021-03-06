const express = require('express');

const handlebars = require('express-handlebars')
const bodyparser = require('body-parser');
const fs = require('fs');
const http = require('http');

const fetch = require('node-fetch');
const app = express();

app.engine('handlebars', handlebars({ defaultLayout: 'main', allowProtoMethodsByDefault: true }))
app.set('view engine', 'handlebars')
app.use('/frameworks', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/bootstrap-select', express.static(__dirname + '/node_modules/bootstrap-select'));
app.use('/popper', express.static(__dirname + '/node_modules/popper.js/dist'));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

const BASE_API = " https://keywords_java.herokuapp.com/api";
const getSettings = { method: "GET" };
const postSettings = { method: 'POST' };

app.get("/", function (req, res) {


    res.render('home');

})

app.get("/buscar-palavras-chave", function (req, res) {

    const titulo = `Palavras chave`;
    const consulta = req.query.chave;
    const reqst = `${BASE_API}/palavra-chave/${consulta}`;

    fetch(reqst, getSettings)
        .then(res => res.json())
        .then((consultaRet) => {

            if (consultaRet && consultaRet.length) {

                res.render('buscapalavraschave', { chaves: consultaRet, titulo });

            } else {

                res.render('buscapalavraschave', { resultado: ": Nenhum resultado encontrado", titulo });

            }
        });

})

app.get("/cadastrar-respostas", function (req, res) {

    const titulo = `Cadastro de respostas`;
    const reqst = `${BASE_API}/palavra-chave`;
    const resultado = req.query.resultado;

    fetch(reqst, getSettings)
        .then(res => res.json())
        .then((consultaRet) => {

            if (consultaRet && consultaRet.length) {

                res.render('cadastroRespostas', { chaves: consultaRet, resultado: resultado, titulo });

            } else {

                res.render('cadastroRespostas', { resultado: ": Nenhum resultado encontrado", titulo });

            }

        });

})

app.post("/executa-cadastro-respostas", function (req, res) {
    const titulo = `Integrar respostas e palavras chave`;
    const chave = req.body.chave;
    const resposta = req.body.resposta;
    
    const reqst = `${BASE_API}/resposta?chave=${chave}&resposta=${resposta}`
    if (chave != undefined && chave.length <= 8) {

        fetch(reqst, postSettings)
            .then(res => res.json())
            .then(res.redirect("/cadastrar-respostas"));
    } else {
        const resultado = "Só podem ser cadastradas 8 palavras chave por resposta";
        res.redirect(`/cadastrar-respostas?resultado=${resultado}`);
    }
})

app.get("/buscar-respostas", function (req, res) {

    const chave = req.query.chave;

    if (chave != undefined) {

        const reqst = `${BASE_API}/resposta/${chave}`;

        fetch(reqst, getSettings)
            .then(res => res.json())
            .then((consultaRet) => {

                if (consultaRet && consultaRet.length) {

                    res.render('buscarrespostas', { chaves: consultaRet });

                } else {

                    res.render('buscarrespostas', { resultado: "Nenhum resultado encontrado" });

                }
            });
    } else {

        res.render('buscarrespostas', { resultado: "Preencha o campo e clique em buscar" });

    }
})

app.get("/cadastrar-palavra-chave", function (req, res) {

    res.render('cadastroPalavrasChave', { titulo: "Cadastrar Palavras chave" });

})


app.post("/cadastrar-palavra-chave", function (req, res) {

    const titulo = `Cadastrar palavras chave`;
    const chavelst = req.body.chave;

    if (chavelst != undefined || caveslst[0] != '') {

        const chavespt = chavelst.split(" ");

        try {

            const reqst = `${BASE_API}/palavra-chave?chave=${chavespt}`

            fetch(reqst, postSettings)
                .then(res => res.json())
                .then(res.render("cadastroPalavrasChave", { titulo }))


        } catch (error) {

            console.log(error);

        }

    } else {

        fetch(reqst, settings)
            .then(res => res.json())
            .then(res.render("cadastrarkeyword", { titulo, resultado: "O campo de cadastro não pode estar vazio, preencha-o e tente novamente" }))
    }
})

app.listen(process.env.PORT || 3500, function () {
    console.log(`------------------------------------
| Aplicativo iniciado corretamente |
------------------------------------`);
})

module.exports = app;
