export function formatarDataHora(dataString) {
  const dataRecebida = new Date(dataString);
  const agora = new Date();
  const diferencaTempo = agora - dataRecebida; // Diferença em milissegundos
  const diferencaDias = diferencaTempo / (1000 * 60 * 60 * 24);

  // Verificar se é o mesmo dia
  const mesmoDia =
    dataRecebida.getDate() === agora.getDate() &&
    dataRecebida.getMonth() === agora.getMonth() &&
    dataRecebida.getFullYear() === agora.getFullYear();

  let dataFormatada = "";

  // Formatar data
  if (mesmoDia) {
    dataFormatada = "Hoje";
  } else if (diferencaDias < 1) {
    dataFormatada = "ontem";
  } else if (diferencaDias >= 2 && diferencaDias <= 7) {
    dataFormatada = `há ${Math.floor(diferencaDias)} dias`;
  } else {
    dataFormatada = dataRecebida
      .toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  }

  // Formatar hora
  const diferencaHoras = diferencaTempo / (1000 * 60 * 60);
  const diferencaMinutos = diferencaTempo / (1000 * 60);
  let horaFormatada = "";

  if (diferencaHoras < 1) {
    if (Math.floor(diferencaMinutos) === 1) {
      horaFormatada = "há 1 minuto";
    } else {
      horaFormatada = `há ${Math.floor(diferencaMinutos)} minutos`;
    }
  } else if (diferencaHoras < 24) {
    if (Math.floor(diferencaHoras) === 1) {
      horaFormatada = "há 1 hora";
    } else {
      horaFormatada = `há ${Math.floor(diferencaHoras)} horas`;
    }
  }

  return `${dataFormatada} ${horaFormatada}`.trim();
}

export function convertSecondsToMinutes(seconds) {
  return Math.floor(seconds / 60);
}

export function formatarDistancia(distancia) {
  if (distancia < 1) {
    return `${distancia.toFixed(3)} m`;
  }
  if (distancia > 1000) {
    return `${(distancia / 1000).toFixed(2)}k Km`;
  }
  return `${distancia.toFixed(2)} Km`;
}

export function formatarDuracao(duracao) {
  if (duracao === 0) {
    return "0 min";
  }
  let minutos = duracao % 60; // Minutos são o resto da divisão de duração por 60
  let totalHoras = Math.floor(duracao / 60); // Total de horas
  let horas = totalHoras % 24; // Horas são o resto da divisão do total de horas por 24
  let dias = Math.floor(totalHoras / 24); // Dias são a divisão do total de horas por 24, arredondado para baixo

  // Construindo a string de retorno
  let resultado = "";
  if (dias > 0) {
    resultado += `${dias}d`;
  }
  if (horas > 0) {
    resultado += `${horas}h`;
  }
  if (minutos > 0) {
    resultado += `${Math.ceil(minutos)}m`;
  }
  return resultado;
}
export function formatarPegadadeCarbono(pegada) {
  if (pegada > 1000) {
    return `${Math.ceil(pegada / 1000)} Kg`;
  }
  return `${Math.ceil(pegada)} g`;
}

export function formatarPontos(pontos) {
  if (pontos >= 1000 && pontos < 100000) {
    return `${Math.floor(pontos / 1000)}k Lps`;
  }
  if (pontos >= 100000) {
    return `${Math.floor(pontos / 100000)}k Lps`;
  }
  return ` ${pontos} Lps`;
}

export function getWeekOfMonth() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const diff =
    now.getTime() -
    startOfMonth.getTime() +
    (startOfMonth.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return Math.ceil((day + startOfMonth.getDay()) / 7);
}

export function getWeekOfPreviousMonth() {
  const now = new Date();
  const month = now.getMonth();
  const startOfMonth = new Date(
    now.getFullYear(),
    month === 0 ? 12 : month - 1,
    1
  );
  const diff =
    now.getTime() -
    startOfMonth.getTime() +
    (startOfMonth.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return Math.ceil((day + startOfMonth.getDay()) / 7);
}
