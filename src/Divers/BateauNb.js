
/** @typedef {import('./Bateau.js')} Bateau */

class BateauNb{

    /**
     * Sert à stocker un bateau et son nombre
     * dans le tableau grille_a_placer de la classe Grille
     * @param {number} nb - nombre de bateau de ce type a placer
     * @param {Bateau} bateau - bateau a placer
     */
    constructor(nb, bateau){
        this.nb = nb;
        this.bateau = bateau
    }
}

export default BateauNb;