export function convertToTransportMode(transport) {
  switch (transport) {
    case "A pé":
      return "WALKING";
    case "Bicicleta":
      return "BICYCLING";
    case "Mota":
      return "DRIVING";
    case "Carro":
      return "DRIVING";
    case "Transportes Públicos":
      return "TRANSIT";
    default:
      return "WALKING";
  }
}

export function convertToTransportString(mode) {
  switch (mode) {
    case "WALKING":
      return "A pé";
    case "BICYCLING":
      return "Bicicleta";
    case "DRIVING":
      return "Carro";
    case "TRANSIT":
      return "Transporte Público";
    case "Multi-Transport":
      return "Multiplos Meios";
    default:
      return "UNKNOWN";
  }
}

export function convertTransportToIconName(transport) {
  switch (transport) {
    case "A pé":
      return "person-walking";
    case "Bicicleta":
      return "bicycle";
    case "Mota":
      return "motorcycle";
    case "Carro":
      return "car-side";
    case "Transporte Público":
      return "bus";
    default:
      return "person-walking";
  }
}

export function transportUsed(list) {
  if (!list) return "No transport used.";
  let t = list[0].transport;
  const l = list.filter((item) => item.transport !== t && item.transport);
  return l.length > 0 ? "Multiplos Meios" : convertToTransportString(t);
}
