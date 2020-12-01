const Express = require('express');

/**
 * Le routage fait référence à la détermination de la manière dont une 
 * application répond à une demande client à un point de terminaison 
 * particulier, qui est un URI (ou un chemin) et une méthode de demande 
 * HTTP spécifique (GET, POST, etc.).
 * Chaque route peut avoir une ou plusieurs fonctions de gestionnaire, 
 * qui sont exécutées lorsque la route correspond.
 * La définition de l'itinéraire prend la structure suivante:
 * route.METHOD (CHEMIN, HANDLER)
 *
 * 
 * GET : Les requêtes GET doivent uniquement être utilisées afin 
 * de récupérer des données.
 *
 *  HEAD : Identique à GET, à la différence qu'il récupère sans le corps 
 * de la réponse. Ceci est utile pour récupérer des méta-informations 
 * écrites dans les en-têtes de réponse, sans avoir à transporter tout le contenu.
 * 
 * PUT : La méthode PUT demande que l'entité incluse soit stockée sous l'URI fourni. 
 * Si l'URI fait référence à une ressource déjà existante, elle est modifiée; 
 * si l'URI ne pointe pas vers une ressource existante, le serveur peut créer 
 * la ressource avec cet URI. [24]
 * 
 * DELETE : La méthode DELETE supprime la ressource spécifiée.
 * 
 * TRACE : La méthode TRACE fait écho à la demande reçue afin qu'un client 
 * puisse voir quels changements ou ajouts (le cas échéant) ont été effectués 
 * par les serveurs intermédiaires.
 * 
 * OPTIONS : La méthode OPTIONS renvoie les méthodes HTTP prises en charge 
 * par le serveur pour l'URL spécifiée. Cela peut être utilisé 
 * pour vérifier la fonctionnalité d'un serveur Web en demandant «*» au 
 * lieu d'une ressource spécifique.
 * 
 * PATCH : La méthode PATCH applique des modifications partielles à une ressource.
 * @type { Router }
 */

const Atelier = Express.Router();

const db = require('../database/db');

Atelier.get("/FindALL", (req, res) => {
    db.atelier.findAll({})
        .then(atelier => {
            if (atelier) {
                res.json({
                    atelier: atelier
                })
            } else {
                res.json({ error: "404 not found " })
            }
        })
        .catch(err => {
            res.json("error" + err);
        })
});

Atelier.put('path', (req, res) => {

});

Atelier.post("/ajouter", (req, res) => {
    var ateliers = {
        nom: req.body.nom,
        garageId: 1 //tout les ateliers ajouter irons dans le garage Id 1
    };
    db.atelier.create(ateliers)
        .then(rep => {
            res.json({ message: 'ok', rep })
        })
        .catch(err => {
            res.json({ error: 'error' + err })
        })


});
//Supprime l'atelier par son ID
Atelier.delete("/delete/:id", (req, res) => {
    //:id = paramètre, delete à besoin de ID car il est unique pour identifier 
    // ou  supprimer
    //cherche si atelier existe
    //findOne : récupère un aliment
    //findAll : récupère tous les éléments

    db.atelier.findOne({
            //where équivalent de if en SQL
            where: { id: req.params.id }
        }).then(atelier => {
            //si il existe fais
            if (atelier) {
                atelier.destroy().then(() => {
                        res.json("atelier deleted")
                    })
                    //erreur si il arrive pas a le supprimer
                    .catch(err => {
                        res.json("error" + err)
                    })
            } else {
                //message d'erreur il ne trouve pas l'élément as supprimer
                res.json({ error: "you can't delete this atelier  it not exist in you list of atelier" })
            }
        })
        .catch(err => {
            //envoie un message d'erreur
            res.json("error" + err);
        })
});

module.exports = Atelier;