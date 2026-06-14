// État global du jeu
let tablier = Array(14).fill(5); // 14 cases contenant chacune 5 graines au départ
let scores = { joueur1: 0, joueur2: 0 };
let tourActuel = 'joueur1'; // Peut être 'joueur1' ou 'joueur2'

// Crée une pause de 'ms' millisecondes
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

window.addEventListener('DOMContentLoaded', () => {
    initialiserPartie();
    configurerEvenements();
});

function mettreAJourInterface() {
            // Mettre à jour le nombre de graines dans chaque case
            document.querySelectorAll('.case').forEach(divCase => {
                const index = parseInt(divCase.getAttribute('data-index'));
                divCase.textContent = tablier[index];

                // Gérer dynamiquement l'activation/désactivation visuelle
                if (estCoupValide(index)) {
                    divCase.classList.remove('disabled');
                } else {
                    divCase.classList.add('disabled');
                }
            });

            // Mettre à jour les scores
            document.getElementById('score-j1').textContent = scores.joueur1;
            document.getElementById('score-j2').textContent = scores.joueur2;

            // Mettre à jour le texte du milieu
            const statut = document.getElementById('statut-partie');
            if (tourActuel === 'joueur1') {
                statut.textContent = "Tour du Joueur 1 (En attente Joueur 2)";
                statut.className = "statut-j1";
            } else {
                statut.textContent = "Tour du Joueur 2 (En attente Joueur 1)";
                statut.className = "statut-j2";
            }
        }


/**
 * Réinitialise la partie
 */
function initialiserPartie() {
    tablier = Array(14).fill(5); //Tableau de 14 cases, tous rempli a 5
    scores = { joueur1: 0, joueur2: 0 };
    tourActuel = 'joueur1';
    console.log("Partie initialisée. C'est au tour du Joueur 1.");
    mettreAJourInterface();
}

/**
 * Lie les clics sur les cases HTML à la logique de jeu
 */
function configurerEvenements() {
    document.querySelectorAll('.case').forEach(divCase => {
        divCase.addEventListener('click', () => {
            const index = parseInt(divCase.getAttribute('data-index'));
            jouerUnTour(index);
        });
    });
}

/**
 * Exécute le coup d'un joueur à partir d'une case choisie
 * @param {number} indexDepart - L'indice de la case cliquée (0 à 13)
 */
async function jouerUnTour(indexDepart) {
    // 1. Vérifications de base
    if (!estCoupValide(indexDepart)) return false;

    let graines = tablier[indexDepart];
    let totalGrainesJouees = graines;
    tablier[indexDepart] = 0; // On vide la case de départ

    // 2. RÈGLE INTERDIT CASE 7 (1 ou 2 graines)
    // Si on joue 1 ou 2 graines depuis sa case 7, elles vont directement à l'adversaire
    let estCase7 = (indexDepart === 0 && tourActuel === 'joueur1') || (indexDepart === 7 && tourActuel === 'joueur2');

    // Si on arrive ici avec la case 7 et 1 ou 2 graines, c'est que le joueur est CONTRAINT
    if (estCase7 && (graines === 1 || graines === 2)) {
        console.log("Joueur contraint ! Les graines de la case 7 sont données à l'adversaire.");
        if (tourActuel === 'joueur1') {
            scores.joueur2 += graines;
        } else {
            scores.joueur1 += graines;
        }
        finaliserTour();
        return true;
    }

    let indexCourant = indexDepart;

    // 3. DISTRIBUTION DES GRAINES
    if (graines <= 13) {
        // Distribution classique en boucle sur tout le tablier
        while (graines > 0) {
            indexCourant = (indexCourant - 1 + 14) % 14;
            tablier[indexCourant]++;
            graines--;

	    // ---  EFFET DE GROSSISSEMENT PAS À PAS ---
    	    let divCase = document.querySelector(`.case[data-index="${indexCourant}"]`);
    	    divCase.classList.add('pulse-seed'); // Grossit

            // À CHAQUE GRAINE : On rafraîchit le visuel et on attend
            mettreAJourInterface();
            await sleep(200); // Temps fort (grossi)
    	    divCase.classList.remove('pulse-seed'); // Reprend sa taille
    	    await sleep(100); // Temps faible avant la case

        }
    } else {
        // Règle spéciale Songo (> 13 graines)
        // Fait un tour complet (13 cases) sans remplir la case de départ
        for (let i = 1; i <= 13; i++) {
            indexCourant = (indexDepart - i + 14) % 14;
            tablier[indexCourant]++;
            // ---  EFFET DE GROSSISSEMENT PAS À PAS ---
            let divCase = document.querySelector(`.case[data-index="${indexCourant}"]`);
            divCase.classList.add('pulse-seed'); // Grossit
            // À CHAQUE GRAINE : On rafraîchit le visuel et on attend
            mettreAJourInterface();
            await sleep(200); // Temps fort (grossi)
            divCase.classList.remove('pulse-seed'); // Reprend sa taille
            await sleep(100); // Temps faible avant la case

        }
        graines -= 13;

        // Distribue le reste EXCLUSIVEMENT dans le camp adverse en boucle
        let debutAdversaire = (tourActuel === 'joueur1') ? 7 : 0;
        let offset = 0; //decalage
        while (graines > 0) {
            indexCourant = debutAdversaire + (6 - offset % 7);
            tablier[indexCourant]++;
            offset++;
            graines--;

	    // ---  EFFET DE GROSSISSEMENT PAS À PAS ---
    	    let divCase = document.querySelector(`.case[data-index="${indexCourant}"]`);
    	    divCase.classList.add('pulse-seed'); // Grossit

            // À CHAQUE GRAINE : On rafraîchit le visuel et on attend
            mettreAJourInterface();
            await sleep(200); // Temps fort (grossi)
    	    divCase.classList.remove('pulse-seed'); // Reprend sa taille
    	    await sleep(100); // Temps faible avant la case
        }
    }

    // On doit aussi ajouter "await" ici car la récolte va prendre du temps
    // 3. GESTION DES RÉCOLTES //LE RAMASSAGE PAS À PAS
    await gererRecolte(indexCourant, totalGrainesJouees);

    // 4. FIN DU TOUR
    finaliserTour();
    return true;
}

/**
 * Gère les gains de graines après la distribution
 */
async function gererRecolte(indexFin, totalGrainesJouees) {
    let joueur = tourActuel;
    let debutAdversaire = (joueur === 'joueur1') ? 7 : 0;
    let finAdversaire = (joueur === 'joueur1') ? 13 : 6;
    let case1Adverse = (joueur === 'joueur1') ? 6 : 13; //modifie etait 7:6

    // Si la distribution ne se termine pas chez l'adversaire, aucune récolte possible
    if (indexFin < debutAdversaire || indexFin > finAdversaire) return;

    let grainesRecoltees = 0;
    let casesAModifier = [];
    let indexScan = indexFin;

    // Exception de la Case 1 adverse (Tour complet exact : 14, 21, 28... graines)
    if (indexFin === case1Adverse && totalGrainesJouees >= 14 && totalGrainesJouees % 7 === 0) {
        if (tablier[case1Adverse] > 0) {
            tablier[case1Adverse]--;
            if (joueur === 'joueur1') scores.joueur1 += 1;
            else scores.joueur2 += 1;
            return; // Fin de la récolte spéciale
        }
    }

    /*// Récolte classique en chaîne (on remonte à l'envers du sens de distribution)
    while (indexScan >= debutAdversaire && indexScan <= finAdversaire) {
        // On ne peut pas récolter normalement (2,3,4) sur la Case 1 si le coup s'y arrête directement
        if (indexScan === case1Adverse && indexScan === indexFin) {
            break;
        }

        let contenu = tablier[indexScan];
        if (contenu === 2 || contenu === 3 || contenu === 4) {
            grainesRecoltees += contenu;
            casesAModifier.push(indexScan);
            indexScan--; // On recule d'une case
        } else {
            break; // La chaîne de récolte est brisée
        }
    }*/

    while (indexScan >= debutAdversaire && indexScan <= finAdversaire) {
        if (indexScan === case1Adverse && indexScan === indexFin) break; //On ne peut pas récolter normalement (2,3,4) sur la Case 1 si le coup s'y arrête directement

        let contenu = tablier[indexScan];
        if (contenu === 2 || contenu === 3 || contenu === 4) {
            grainesRecoltees += contenu;
            casesAModifier.push(indexScan);
            indexScan = (indexScan + 1) % 14; // Remonte à l'envers
        } else {
            break;
        }
    }

    // RÈGLE ANTI-FAMINE : Vérifier si la récolte viderait totalement l'adversaire
    let grainesRestantesAdversaire = 0;
    for (let i = debutAdversaire; i <= finAdversaire; i++) {
        if (!casesAModifier.includes(i)) {
            grainesRestantesAdversaire += tablier[i];
        }
    }

    // Si l'adversaire a encore au moins une graine après simulation, on valide la récolte
    if (grainesRestantesAdversaire > 0 && grainesRecoltees > 0) {

        // 1. ALLUMER TOUTES les cases cibles en ROUGE et les faire grossir en même temps
        casesAModifier.forEach(idx => {
            document.querySelector(`.case[data-index="${idx}"]`).classList.add('harvest-target');
        });

        // On maintient l'effet visuel rouge pendant 800 millisecondes
        await sleep(800);

        // 2. VIDER les cases et enlever l'effet rouge en même temps
        casesAModifier.forEach(idx => {
            tablier[idx] = 0;
            document.querySelector(`.case[data-index="${idx}"]`).classList.remove('harvest-target');
        });

        // 3. Ajouter les points au joueur concerné
        if (joueur === 'joueur1') scores.joueur1 += grainesRecoltees;
        else scores.joueur2 += grainesRecoltees;

        // On rafraîchit enfin l'affichage des chiffres et des scores
        mettreAJourInterface();

    } else {
        console.log("Récolte annulée : Interdit de vider le camp adverse !");
    }
}

/**
 * Vérifie si le joueur a d'autres cases jouables que sa case 7. Pour la regle de on joue pas 1 ou 2 graines depuis la case 7
 */
function aDautresOptions(joueur) {
    // Pour le Joueur 1, on regarde les cases 1 à 6 (indices 0 à 5)
    // Pour le Joueur 2, on regarde les cases 1 à 6 (indices 7 à 12)
    let debut = (joueur === 'joueur1') ? 0 : 7;
    let fin = (joueur === 'joueur1') ? 5 : 12;

    for (let i = debut; i <= fin; i++) {
        if (tablier[i] > 0) {
            return true; // Il a au moins une autre case avec des graines
        }
    }
    return false; // La case 7 est sa seule option
}

/**
 * Valide si le joueur a le droit de cliquer sur cette case
 */
function estCoupValide(index) {
    let graines = tablier[index];
    // Vérifier si la case appartient au joueur actif
    if (tourActuel === 'joueur1' && (index < 0 || index > 6)) return false;
    if (tourActuel === 'joueur2' && (index < 7 || index > 13)) return false;

    // Vérifier si la case n'est pas vide
    if (tablier[index] === 0) return false;

    let estCase7 = (index === 0 && tourActuel === 'joueur1') || (index === 7 && tourActuel === 'joueur2');

    if (estCase7 && (graines === 1 || graines === 2)) {
        // Si le joueur a d'autres choix, ce coup est STRICTEMENT INTERDIT (case non-cliquable)
        if (aDautresOptions(tourActuel)) {
            console.log("Action impossible : Interdit de jouer 1 ou 2 graines depuis la case 7 !");
            return false;
        }
    }

    // RÈGLE DE SOLIDARITÉ : Si l'adversaire est totalement vide
    let adverseDebut = (tourActuel === 'joueur1') ? 7 : 0;
    let adverseFin = (tourActuel === 'joueur1') ? 13 : 6;
    let totalAdversaire = tablier.slice(adverseDebut, adverseFin + 1).reduce((a, b) => a + b, 0); //slice recupere une partie du tableau. Les cases de x a y-1

    if (totalAdversaire === 0) {
        // Le joueur DOIT nourrir son adversaire. Idéalement avec 7 graines, sinon le max possible.
        // On simule pour voir si ce coup envoie des graines en face
        if (!coupNourritAdversaire(index)) {
            // S'il existe un autre coup qui nourrit mieux, celui-ci est invalide
            if (existeMeilleurCoupNourricier()) {
                console.log("Coup invalide : Vous devez appliquer la règle de solidarité !");
                return false;
            }
        }
    }

    return true;
}

/**
 * Alterne le tour et vérifie les conditions de victoire
 */
function finaliserTour() {
    // Vérification des scores de victoire immédiate (>= 40 graines)
    if (scores.joueur1 >= 40) {
        console.log("Joueur 1 a gagné avec " + scores.joueur1 + " graines !");
        return;
    }
    if (scores.joueur2 >= 40) {
        console.log("Joueur 2 a gagné avec " + scores.joueur2 + " graines !");
        return;
    }

    // Compte total des graines restantes sur le tablier
    let grainesTotalesTablier = tablier.reduce((a, b) => a + b, 0); //0 indice de depart, a accumulateur, b le contenu de la case actuel
    if (grainesTotalesTablier < 10) {
        // Fin de partie, les graines restantes vont à leur camp respectif
        for (let i = 0; i < 7; i++) scores.joueur1 += tablier[i];
        for (let i = 7; i < 14; i++) scores.joueur2 += tablier[i];

        if (scores.joueur1 > scores.joueur2) console.log("Joueur 1 gagne au décompte final !");
        else if (scores.joueur2 > scores.joueur1) console.log("Joueur 2 gagne au décompte final !");
        else console.log("Match nul !");
        return;
    }

    // Changement de tour
    tourActuel = (tourActuel === 'joueur1') ? 'joueur2' : 'joueur1';
    console.log("C'est au tour de : " + tourActuel);

    mettreAJourInterface();
}

// Fonctions utilitaires à développer pour la solidarité stricte
function coupNourritAdversaire(indexDepart) {
            let graines = tablier[indexDepart];
            let indexCourant = indexDepart;
            let debutAdversaire = (tourActuel === 'joueur1') ? 7 : 0;
            let finAdversaire = (tourActuel === 'joueur1') ? 13 : 6;

            // Simulation rapide de la distribution
            if (graines <= 13) {
                while (graines > 0) {
                    indexCourant = (indexCourant - 1 + 14) % 14;
                    if (indexCourant >= debutAdversaire && indexCourant <= finAdversaire) return true;
                    graines--;
                }
            } else {
                return true; // Plus de 13 graines distribue obligatoirement chez l'adversaire
            }
	return false;
}

/**
 * Vérifie s'il existe une autre case qui pourrait nourrir l'adversaire
 */
function existeMeilleurCoupNourricier() {
    let debut = (tourActuel === 'joueur1') ? 0 : 7;
    let fin = (tourActuel === 'joueur1') ? 6 : 13;

    for (let i = debut; i <= fin; i++) {
        if (tablier[i] > 0 && coupNourritAdversaire(i)) {
            // On s'assure que ce n'est pas une case 7 interdite par ailleurs
            let graines = tablier[i];
            let estCase7 = (i === 0 && tourActuel === 'joueur1') || (i === 7 && tourActuel === 'joueur2');
            if (estCase7 && (graines === 1 || graines === 2) && aDautresOptions(tourActuel)) continue;

            return true;
        }
    }
    return false;
}

// --- ÉCOUTEURS D'ÉVÉNEMENTS (CLICS) ---
        document.querySelectorAll('.case').forEach(divCase => {
            divCase.addEventListener('click', () => {
                const index = parseInt(divCase.getAttribute('data-index'));
                jouerUnTour(index);
            });
        });
