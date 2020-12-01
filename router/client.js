const express = require('express');
const route = Express.Router();

const db = require("../database.db");
//rajoute un nouveau client, marque et voiture
route.post('/new', (req, res) => {
    //rajouter des nouvelles données dans la table "marque" si elle n'existe pas
    const marque = {
        marque: req.body.marque
    };
    //créer les données client si on as besoin de l'ajouter

    const clientdata = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        tel: req.body.tel
    };
    //trouver client si il n'existe pas dans la base de données
    db.client.findOne({
            where: { email: req.body.email }
        })
        .then(client => {
            //si le client n'est pas dans la base de donnée
            if (!client) {
                //créer client en lui passant le DATA client (paramètre)
                db.client.create(clientdata)
                    .then(data => {
                        // CARDATA: stock tous les éléments pour pouvoir créer la voiture
                        const cardata = {
                            modele: req.body.modele,
                            type_moteur: req.body.type_moteur,
                            numero_plaque: req.body.numero_plaque,
                            annee: req.body.annee,
                            couleur: req.body.couleur,
                            clientId: data.id
                        };
                        //recherche si voiture n'existe pas avec numéro de plaques
                        db.voiture.findOne({
                                where: { numero_plaque: req.body.numero_plaque }
                            })
                            .then(voiture => {
                                //si la voiture n'existe pas on crée la voiture
                                if (!voiture) {
                                    //crée la voiture en lui passant les paramètres CARDATA
                                    db.voiture.create(cardata)
                                        .then(car => {
                                            //récupère le client et les voitures associées avec son ID
                                            db.client.findOne({
                                                    include: [{
                                                        model: db.voiture
                                                    }],
                                                    where: { id: data.id }
                                                })
                                                .then(client => {
                                                    //on renvoi la reponse sous le format JSON
                                                    res.json({ client: client });
                                                })
                                                .catch(err => {
                                                    //renvoi une erreur si jamais une erreur se produit lors de la récupération du client via son ID
                                                    res.json({
                                                        error: "error" + err
                                                    })
                                                })
                                        })
                                } else {
                                    res.json({
                                        message: "this voiture is already in" + "your database, you can't add ..."
                                    })
                                }
                            })
                            .catch(err => {
                                res.json({
                                    error: "error" + err
                                })
                            })
                    })
                    .catch(err => {
                        res.json({
                            error: "error" + err
                        })
                    })

            } else {
                res.json({
                    message: "client déjà dans la base"
                })

            }
        })
        .catch(err => {
            res.json({
                error: "error" + err
            })
        })

});