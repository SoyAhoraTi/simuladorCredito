$(() => {
  const tasaComisionMaxima = 10
  const tasaQuincenalCantidad = 24
  const tasaMensualCantidad = 12
  const tasaSemanalCantidad = 48


  $("#calcularCuota").click(() => {

    let montoPrestamo = $("#monto").val()
    let plazoMeses = $("#plazo").val()
    var tasaInteresAnual = 0.6; // Tasa de interés anual (60% anual)
    let periodoCobro = $("#periodo_cobro").val() //string
    
    let tasaComisionAnual = $("#tasa_comision").val() //TODO pendiente de revisar
    let tipoCuota = $("#tipo_cuota").val() //string
    let tasaInteresMensual = 0
    let tasaComisionMensual = 0
    

    $('#tablaCuotas').empty();
    if(periodoCobro === "mensual"){
      periodoCobro = 30
      // Convertir tasas anuales a mensuales
      tasaInteresMensual = tasaInteresAnual / tasaMensualCantidad;
      tasaComisionMensual = tasaComisionAnual / tasaMensualCantidad;
    }
    else if(periodoCobro === "quincenal"){
      plazoMeses = plazoMeses * 2
      tasaInteresMensual = tasaInteresAnual / tasaQuincenalCantidad;
      tasaComisionMensual = tasaComisionAnual / tasaQuincenalCantidad;
      periodoCobro = 15
    }else if(periodoCobro === "semanal"){
        plazoMeses = plazoMeses * 4
        tasaInteresMensual = tasaInteresAnual / tasaSemanalCantidad;
        tasaComisionMensual = tasaComisionAnual / tasaSemanalCantidad;
        periodoCobro = 7
    }

    console.log(tasaInteresMensual,tasaComisionMensual,plazoMeses,montoPrestamo, periodoCobro)
      //let montoCuota = calcularMontoCuota(montoPrestamo, tasaInteresMensual, plazoMeses)
      //let montoPrestamo1 = calcularMontoPrestamo(montoCuota,tasaInteresMensual, plazoMeses)
      let detalleMontoCuotas = calcularDetallesCuotas(tasaInteresMensual,tasaComisionMensual,plazoMeses,montoPrestamo, periodoCobro)
      console.log(detalleMontoCuotas)

  })

  function calcularMontoCuota(montoPrestamo, tasaInteresQuincenal, numeroCuotas) {
    const numerador = montoPrestamo * tasaInteresQuincenal;
    const denominador = 1 - Math.pow(1 + tasaInteresQuincenal, -numeroCuotas);
    return numerador / denominador;
}

  

  function calcularDetallesCuotas(tasaInteresQuincenal,tasaComisionQuincenal,numeroCuotas,montoTotalCredito, periodoCobro) {
    
    

    const montoCuota = calcularMontoCuota(montoTotalCredito, tasaInteresQuincenal, numeroCuotas);

    let detallesCuotas = [];

    // Calcula los detalles de cada cuota
    for (let i = 1; i <= numeroCuotas; i++) {
        const comision = montoCuota * tasaComisionQuincenal;
        const interes = (montoTotalCredito - comision) * tasaInteresQuincenal;
        const principal = montoCuota - interes - comision;
        const deslizamiento = montoCuota - principal - interes - comision;
        const fechaCuota = new Date(new Date().setDate(new Date().getDate() + (periodoCobro * i)));

        agregarFila(i,fechaCuota,periodoCobro,principal.toFixed(2),deslizamiento.toFixed(2),interes.toFixed(2),comision.toFixed(2),montoCuota.toFixed(2))

        detallesCuotas.push({
            numeroCuota: i,
            fechaCuota: fechaCuota.toLocaleDateString('es-ES'),
            dias: periodoCobro,
            principal: principal.toFixed(2),
            deslizamiento: deslizamiento.toFixed(2),
            interes: interes.toFixed(2),
            comision: comision.toFixed(2),
            montoCuota: montoCuota.toFixed(2)
        });
    }

    return detallesCuotas;
}

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


})