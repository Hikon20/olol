const Express = require('express');

const route = Express.Router();

const db = require('../database/db');

route.get('/All', (req, res) => {
    db.garage.findAll({})
        .then(garage => {
            if (garage) {
                res.json({
                    garage: garage
                });
            } else {
                res.json({ error: "je n'est rien dans la table garage" });
            }
        }).catch(err => {
            res.json("error" + err);
        })

});

route.post("/ajoute", (req, res) => {
    var garages = {
        nom: req.body.nom,
        adresse: req.body.adresse,
        cp: req.body.cp,
        ville: req.body.ville,
        tel: req.body.tel,
        email: req.body.email
    };
    db.garage.create(garages)
        .then(rep => {
            res.json({ message: 'ok', rep })
        })
        .catch(err => {
            res.json({ error: 'error' + err })
        })


});

route.put("/update/:id", (req, res) => {
    db.garage.findOne({
            where: { id: req.params.id }
        })
        .then(garage => {
            if (garage) {
                garage.update({
                        nom: req.body.nom,
                        adresse: req.body.adresse,
                        cp: req.body.cp,
                        ville: req.body.ville,
                        email: req.body.email
                    }, {
                        //returning = retourne true lorsque l'action est validée
                        returning: true,
                        //
                        plain: true
                    })
                    .then(garage => {
                        res.json({ garage: garage })
                    })
                    .catch(err => {
                        res.json("error" + err)
                    })
            } else {
                res.json("can't update")
            }
        })
        .catch(err => {
            res.json("error" + err)
        })

});

module.exports = route;