$(() => {

  const tasaComisionMaxima = 10

  $(".plazo").keyup(function(){
    
    let valor = $(this).val()

    if(valor >= 10){
      $("#tasa_comision").val(tasaComisionMaxima)
    }else{
      $("#tasa_comision").val(valor)
    }
    
  })

    const tasaQuincenalCantidad = 24
    const tasaMensualCantidad = 12
    const tasaSemanalCantidad = 48

    

    let tasaInteresMensual = 0
    let tasaComisionMensual = 0
    

    $("#calcularCuota").click(() => {

      var totalPrincipal = 0
    var totalInteres = 0
    var totalDeslizamiento = 0
    var totalComision = 0
    var totalMontoCuotas = 0
    let fechaAnterior = ''

        let montoPrestamo = $("#monto").val()
        let plazoMeses = $("#plazo").val()
        var tasaInteresAnual = 0.6; // Tasa de interés anual (60% anual)
        let periodoCobro = $("#periodo_cobro").val() //string
        let mantenimientoValor = 0
        
        let tasaComisionAnual = $("#tasa_comision").val() * 0.01 //pasado del porcentaje al numerico
        let tipoCuota = $("#tipo_cuota").val() //string

        let principal = Number(montoPrestamo).toFixed(2)
        
        
        let fechas = []

        

        $('#tablaCuotas').empty();
        if(periodoCobro === "mensual"){
          periodoCobro = 30
          // Convertir tasas anuales a mensuales
          tasaInteresMensual = (tasaInteresAnual / tasaMensualCantidad).toFixed(2);
          tasaComisionMensual = (tasaComisionAnual / tasaMensualCantidad).toFixed(2);
          fechas = obtenerFechasMensuales(plazoMeses);
        }
        else if(periodoCobro === "quincenal"){
          plazoMeses = plazoMeses * 2
          tasaInteresMensual = (tasaInteresAnual / tasaQuincenalCantidad).toFixed(2);
          tasaComisionMensual = (tasaComisionAnual / tasaQuincenalCantidad).toFixed(2);
          periodoCobro = 15
          fechas = obtenerFechasQuincenales(plazoMeses);
        }else if(periodoCobro === "semanal"){
            plazoMeses = plazoMeses * 4
            tasaInteresMensual = (tasaInteresAnual / tasaSemanalCantidad).toFixed(2);
            tasaComisionMensual = (tasaComisionAnual / tasaSemanalCantidad).toFixed(2);
            periodoCobro = 7
            fechas = obtenerFechasSemanales(plazoMeses);
        }

        let amortizacion = montoPrestamo / plazoMeses
        let comisionGeneral = tasaComisionAnual * montoPrestamo
        let comisionMensual = comisionGeneral / plazoMeses
        
        if (tipoCuota === "variable"){
          for(let i = 1; i <= plazoMeses; i++){
            
            
            let interesesMensuales = ((((principal + mantenimientoValor) * tasaInteresAnual) * periodoCobro) / 360).toFixed(2)
            let cuotaMensual = (amortizacion + comisionMensual + mantenimientoValor + Number(interesesMensuales))
  
            principal -= amortizacion
            
            
            let fechaTemp = formatearFecha(fechas[i-1]);
            
            fechaAnterior = fechaAnterior == '' ? new Date() : fechaAnterior
            
            let diferenciaDias = diferenciaEnDias(fechaAnterior, fechas[i-1])

            agregarFila(i, fechaTemp, diferenciaDias, amortizacion, 0, interesesMensuales, comisionMensual, cuotaMensual, principal) 
            console.log(fechaAnterior, fechas[i-1], diferenciaDias)
            fechaAnterior = fechas[i-1]
            
            totalPrincipal += Number(amortizacion)
            totalDeslizamiento += 0
            totalInteres += Number(interesesMensuales)
            totalComision += Number(comisionMensual)
            totalMontoCuotas += Number(cuotaMensual)
          }
        }

        
        
        //agregar totales de todos los campos
        agregarFila("TOTALES", "", "", Number(totalPrincipal).toFixed(2), totalDeslizamiento, Number(totalInteres).toFixed(2), Number(totalComision).toFixed(2), Number(totalMontoCuotas).toFixed(2), "") 

    })

    function agregarFila(noCuota, fecCuota, cantidadDias, cuotaPrincipal, deslizamiento, interes, comisionMensual, montoCuota, saldo) {
   
        var htmlTags = '<tr>'+
             '<td>' + noCuota + '</td>'+
             '<td>' + fecCuota + '</td>'+
             '<td>' + cantidadDias + '</td>'+
             '<td>' + cuotaPrincipal + '</td>'+
             '<td>' + deslizamiento + '</td>'+
             '<td>' + interes + '</td>'+
             '<td>' + comisionMensual + '</td>'+
             '<td>' + montoCuota + '</td>'+
             '<td>' + saldo + '</td>'+
           '</tr>';
           
        $('#tablaCuotas').append(htmlTags);
     
     }

     // Función para obtener una lista de fechas mensuales
function obtenerFechasMensuales(iteraciones) {
  let fechas = [];
  let fechaActual = new Date();
  let cantidadDiasAgregar = 30

  fechaActual.setDate(fechaActual.getDate() + cantidadDiasAgregar);
  
  
  for (let i = 0; i < iteraciones; i++) {
      if (fechaActual.getDay() !== 0) { // Evitar fechas que caigan en domingo
          fechas.push(new Date(fechaActual));
      }else{
        fechaActual.setDate(fechaActual.getDate() + 1);
        fechas.push(new Date(fechaActual));
      }
      fechaActual.setMonth(fechaActual.getMonth() + 1);
  } 
  
  return fechas;
}

// Función para obtener una lista de fechas quincenales
function obtenerFechasQuincenales(iteraciones) {
  let cantidadDiasAgregar = 15
  let fechas = [];
  let fechaActual = new Date();
  fechaActual.setDate(fechaActual.getDate() + 15)
  
  for (let i = 0; i < iteraciones; i++) {
      if (fechaActual.getDay() !== 0) { // Evitar fechas que caigan en domingo
          fechas.push(new Date(fechaActual));
      }else{
        fechaActual.setDate(fechaActual.getDate() + 1);
        fechas.push(new Date(fechaActual));

      }
      fechaActual.setDate(fechaActual.getDate() + cantidadDiasAgregar);
  }
  
  return fechas;
}

// Función para obtener una lista de fechas semanales
function obtenerFechasSemanales(iteraciones) {
  let cantidadDiasAgregar = 7
  let fechas = [];
  let fechaActual = new Date();
  fechaActual.setDate(fechaActual.getDate() + 7)

  for (let i = 0; i < iteraciones; i++) {
      if (fechaActual.getDay() !== 0) { // Evitar fechas que caigan en domingo
          fechas.push(new Date(fechaActual));
      }else{
        fechaActual.setDate(fechaActual.getDate() + 1);
        fechas.push(new Date(fechaActual));
      }
      fechaActual.setDate(fechaActual.getDate() + cantidadDiasAgregar);
  }
  
  return fechas;
}

// Función para formatear la fecha en dd-mm-yyyy
function formatearFecha(fecha) {
  const date = new Date(fecha);
  const dia = date.getDate();
  const mes = date.getMonth() + 1; // Los meses van de 0 a 11 en JavaScript
  const año = date.getFullYear();
  return `${dia < 10 ? '0' + dia : dia}-${mes < 10 ? '0' + mes : mes}-${año}`;
}

function diferenciaEnDias(fecha1, fecha2) {

 
  const unDia = 1000 * 60 * 60 * 24; // Milisegundos en un día
  const diferenciaMs = Math.abs(fecha1 - fecha2);
  
  return Math.round(diferenciaMs / unDia);
}

    

})