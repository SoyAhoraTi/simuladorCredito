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

    var totalPrincipal = 0
    var totalInteres = 0
    var totalDeslizamiento = 0
    var totalComision = 0
    var totalMontoCuotas = 0

    let tasaInteresMensual = 0
    let tasaComisionMensual = 0

    $("#calcularCuota").click(() => {

        let montoPrestamo = $("#monto").val()
        let plazoMeses = $("#plazo").val()
        var tasaInteresAnual = 0.6; // Tasa de interés anual (60% anual)
        let periodoCobro = $("#periodo_cobro").val() //string
        let mantenimientoValor = 0
        
        let tasaComisionAnual = $("#tasa_comision").val() * 0.01 //pasado del porcentaje al numerico
        let tipoCuota = $("#tipo_cuota").val() //string

        let principal = Number(montoPrestamo).toFixed(2)
        
        
        let fechas = []

        

        let fechasQuincenales = obtenerFechasQuincenales(16);
        console.log("Fechas quincenales:", fechasQuincenales);

        let fechasSemanales = obtenerFechasSemanales(32);
        console.log("Fechas semanales:", fechasSemanales);

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
            let cantidadDias1 = obtenerCantidadDiasMesAño(2024, 6)
            
            let interesesMensuales = ((((principal + mantenimientoValor) * tasaInteresAnual) * periodoCobro) / 360).toFixed(2)
            let cuotaMensual = (amortizacion + comisionMensual + mantenimientoValor + Number(interesesMensuales))
  
            principal -= amortizacion
            
            let fechaTemp = fechas[i-1].getDate()
            agregarFila(i, fechaTemp, cantidadDias1, amortizacion, 0, interesesMensuales, comisionMensual, cuotaMensual, principal) 

            
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

     function obtenerCantidadDiasMesAño(anyo, mes){

        let diasMes = new Date(anyo, mes, 0).getDate();
        console.log(diasMes, mes, anyo)
        let diasSemana = ['Domingo','Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        console.log(new Date().getDay())
        for (var dia = 1; dia <= diasMes; dia++) {
          // Ojo, hay que restarle 1 para obtener el mes correcto
          var indice = new Date(anyo, mes - 1, dia).getDay();
          console.log(`El día número ${dia} del mes ${mes} del año ${anyo} es ${diasSemana[indice]}`);
        }
    
        return diasMes
      }

      

})