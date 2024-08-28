import { PointType } from "../../types/PointType";

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const optionsDate: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const formattedDate = date.toLocaleDateString('pt-PT', optionsDate);
    const formattedTime = date.toLocaleTimeString('pt-PT', optionsTime);
    return `${formattedDate} às ${formattedTime}`;
};

export const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = Math.floor(duration % 60);
    const fractionalPart = hours == 0 ? duration - minutes : duration - hours * 60 - minutes;
    const seconds = Math.round(60 / (100 / (fractionalPart * 100)));
    return `${hours}h ${minutes}m ${seconds}s`;
};

export const formatDistance = (distance: number) => {
    return `${distance.toFixed(3).replace('.', ',')} km`;
};

export const formatCarbon = (carbonFootprint: number) => {
    if (carbonFootprint > 1000) {
        return `${(carbonFootprint / 1000).toFixed(3).replace('.', ',')} kg`;
    }
    return `${Math.ceil(carbonFootprint)} g`;
};

export const formatTransport = (points: PointType[]) => {
    let transport = points[0].transport;
    if (points.length > 2) {
        for (let i = 1; i < points.length - 1; i++) {
            if (points[i].transport !== points[i - 1].transport) {
                return "multi-transporte";
            } else {
                transport = points[i].transport;
            }
        }
    }

    if (transport === "WALKING") {
        return "A pé";
    } else if (transport === "BICYCLING") {
        return "Bicicleta";
    } else if (transport === "DRIVING") {
        return "Carro";
    } else {
        return "Transportes públicos";
    }
}