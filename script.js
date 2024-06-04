// Función para obtener una lista de fechas mensuales
function obtenerFechasMensuales(iteraciones) {
  let fechas = [];
  let fechaActual = new Date();
  
  for (let i = 0; i < iteraciones; i++) {
      if (fechaActual.getDay() !== 0) { // Evitar fechas que caigan en domingo
          fechas.push(new Date(fechaActual));
      }
      fechaActual.setMonth(fechaActual.getMonth() + 1);
  }
  
  return fechas;
}

// Función para obtener una lista de fechas quincenales
function obtenerFechasQuincenales(iteraciones) {
  let fechas = [];
  let fechaActual = new Date();
  
  for (let i = 0; i < iteraciones; i++) {
      if (fechaActual.getDay() !== 0) { // Evitar fechas que caigan en domingo
          fechas.push(new Date(fechaActual));
      }
      fechaActual.setDate(fechaActual.getDate() + 14);
  }
  
  return fechas;
}

// Función para obtener una lista de fechas semanales
function obtenerFechasSemanales(iteraciones) {
  let fechas = [];
  let fechaActual = new Date();
  
  for (let i = 0; i < iteraciones; i++) {
      if (fechaActual.getDay() !== 0) { // Evitar fechas que caigan en domingo
          fechas.push(new Date(fechaActual));
      }
      fechaActual.setDate(fechaActual.getDate() + 7);
  }
  
  return fechas;
}

// Ejemplo de uso
let iteraciones = 5;

let fechasMensuales = obtenerFechasMensuales(8);
console.log("Fechas mensuales:", fechasMensuales);

let fechasQuincenales = obtenerFechasQuincenales(16);
console.log("Fechas quincenales:", fechasQuincenales);

let fechasSemanales = obtenerFechasSemanales(32);
console.log("Fechas semanales:", fechasSemanales);
