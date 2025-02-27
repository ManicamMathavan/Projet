class Coord {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
 static addCoord(coord1, coord2) {
  console.log(new Coord(coord1.x + coord2.x, coord1.y + coord2.y))
    return new Coord(coord1.x + coord2.x, coord1.y + coord2.y);
  }

  static subCoord(coord1, coord2) {
    return new Coord(coord1.x - coord2.x, coord1.y - coord2.y);
  }

}
export default Coord;