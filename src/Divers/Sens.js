import Coord from "./Coord";

const Sens=Object.freeze({
    DROITE:new Coord(1, 0),
    GAUCHE:new Coord(-1, 0),
    HAUT:new Coord(0, -1),
    BAS:new Coord(0, 1)
    });
export default Sens;
