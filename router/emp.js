const Express = require('express');
// Le routage consiste à déterminer comment une application répond à une demande 
//client adressée à un noeud final particulier, à savoir un URI (ou chemin) et une méthode 
//de requête HTTP spécifique (GET, POST, etc.).
//Chaque route peut avoir une ou plusieurs fonctions de gestionnaire, 
//qui sont exécutées lorsque la route est appariée.
const route = Express.Router();

const jwt = require('jsonwebtoken');
/* bcrypt est une fonction de hachage créée par Niels Provos et David Mazières. 
Elle est basée sur l'algorithme de chiffrement Blowfish et a été présentée lors de 
USENIX en 19991. En plus de l'utilisation d'un sel pour se protéger des attaques par 
table arc-en-ciel (rainbow table), bcrypt est une fonction adaptative, c'est-à-dire 
que l'on peut augmenter le nombre d'itérations pour la rendre plus lente. 
Ainsi elle continue à être résistante aux attaques par force brute malgré 
l'augmentation de la puissance de calcul.

Blowfish est un algorithme de chiffrement par bloc notable pour sa phase 
d'établissement de clef relativement coûteuse. bcrypt utilise cette propriété 
et va plus loin. Provos et Mazières ont conçu un nouvel algorithme d'établissement 
des clefs nommé Eksblowfish (pour Expensive Key Schedule Blowfish). 
Dans cet algorithme, une première phase consiste à créer les sous-clefs grâce à 
la clef et au sel. Ensuite un certain nombre de tours de l'algorithme standard 
blowfish sont appliqués avec alternativement le sel et la clef. 
Chaque tour commence avec l'état des sous-clefs du tour précédent. 
Cela ne rend pas l'algorithme plus puissant que la version standard de blowfish, 
mais on peut choisir le nombre d'itérations ce qui le rend arbitrairement lent et 
contribue à dissuader les attaques par table arc-en-ciel et par force brute.
Le nombre d'itérations doit être une puissance de deux, 
c'est un paramètre de l'algorithme et ce nombre est codé dans le résultat final. */
const bcrypt = require('bcrypt');

const db = require('../database/db');

process.env.SECRET_KEY = "secret";

route.post("/register", (req, res) => {
    const userdata = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        password: req.body.password
    };
    db.emp.findOne({
            where: { email: req.body.email }
        })
        .then(user => {
            if (!user) {
                //encode le password avec le module bcrypt salt: nb de tour d'encodage (niveau de sécurité)
                const hash = bcrypt.hashSync(userdata.password, 10);
                userdata.password = hash;
                db.emp.create(userdata)
                    .then(user => {
                        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                            expiresIn: 1440
                        });
                        res.json({ token: token })
                    })
                    .catch(err => {
                        res.json('error' + err)
                    })
            } else {
                res.json({
                    error: "user already exists"
                })
            }
        })
        .catch(err => {
            res.json({
                error: "error" + err
            })
        })
})

route.post("/login", (req, res) => {
    db.emp.findOne({
            where: { email: req.body.email }
        })
        .then(user => {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                    expiresIn: 1440
                });
                res.json({
                    token: token
                })
            } else {
                req.json('error mail or error password')
            }
        })
        .catch(err => {
            res.send('error' + err)
        })
})

module.exports = route;