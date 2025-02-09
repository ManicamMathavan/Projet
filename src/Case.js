
class Case {
    #tirer;
    #interdit;
    #bateau;
  constructor() {
    this.#tirer = false;
    this.#interdit=0;
    this.#bateau = null;
  }
    set bateau(value){
        this.#bateau = value;
    }
    get bateau(){
        return this.#bateau
    }
  set tirer (value){
    this.#tirer = value;
  }
    get tirer(){
      return this.#tirer;
    }
    set interdit(value){  
      this.#interdit = value;
    }
    get interdit(){
      return this.#interdit;
    }

}

export default Case;