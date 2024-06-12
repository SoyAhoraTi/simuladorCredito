$(() => {

  const tasaComisionMaxima = 10
  const tasaComisionMinima = 3

  $(".plazo").on('input',function(){
    
    let valor = $(this).val()
    console.log(Number(valor))

    if(valor <= 3 && valor >= 1){
      $("#tasa_comision").val(tasaComisionMinima)
    }
    else if(valor >= 10 && valor <= 12){
      $("#tasa_comision").val(tasaComisionMaxima)
    }else if(valor > 12 || valor < 1){
      $(this).val('')
      alert("El plazo debe de estar establecido entre 1 mes y 12 meses como maximo.")
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
      var totalDias = 0
    var totalInteres = 0
    var totalDeslizamiento = 0
    var totalComision = 0
    var totalMontoCuotas = 0
    

        let montoPrestamo = $("#monto").val()
        let plazoMeses = $("#plazo").val()
        var tasaInteresAnual = 0.6; // Tasa de interés anual (60% anual)
        let periodoCobro = $("#periodo_cobro").val() //string
        let mantenimientoValor = 0
        
        let tasaComisionAnual = $("#tasa_comision").val() * 0.01 //pasado del porcentaje al numerico
        let tipoCuota = $("#tipo_cuota").val() //string

        let principal = Number(montoPrestamo).toFixed(2)

       
        let seleccionFecha = $("#fechaPrimerCuota").val().split('-')
        let fechaAnterior = seleccionFecha.length != 3 ? new Date() : new Date(seleccionFecha[0],seleccionFecha[1] -1,seleccionFecha[2],0,0,0)
        
        
        let fechas = []

        $('#tablaCuotas').empty();
        if(periodoCobro === "mensual"){
          periodoCobro = 30
          // Convertir tasas anuales a mensuales
          tasaInteresMensual = (tasaInteresAnual / tasaMensualCantidad).toFixed(2);
          tasaComisionMensual = (tasaComisionAnual / tasaMensualCantidad).toFixed(2);
          fechas = obtenerFechasMensuales(plazoMeses,fechaAnterior);
        }
        else if(periodoCobro === "quincenal"){
          plazoMeses = plazoMeses * 2
          tasaInteresMensual = (tasaInteresAnual / tasaQuincenalCantidad).toFixed(2);
          tasaComisionMensual = (tasaComisionAnual / tasaQuincenalCantidad).toFixed(2);
          periodoCobro = 15
          fechas = obtenerFechasQuincenales(plazoMeses,fechaAnterior);
        }else if(periodoCobro === "semanal"){
            plazoMeses = plazoMeses * 4
            tasaInteresMensual = (tasaInteresAnual / tasaSemanalCantidad).toFixed(2);
            tasaComisionMensual = (tasaComisionAnual / tasaSemanalCantidad).toFixed(2);
            periodoCobro = 7
            fechas = obtenerFechasSemanales(plazoMeses,fechaAnterior);
        }

        let amortizacion = montoPrestamo / plazoMeses
        let comisionGeneral = tasaComisionAnual * montoPrestamo
        let comisionMensual = comisionGeneral / plazoMeses
        
        
        if (tipoCuota === "variable"){
          for(let i = 1; i <= plazoMeses; i++){
            
            //fechas y obtener la cantidades de dias entre cada fecha
            let fechaTemp = formatearFecha(fechas[i-1]);
            let diferenciaDias = diferenciaEnDias(i==1 ? new Date() : fechaAnterior, fechas[i-1])
            
            //principal * tasa de interes anual * cantidad de dias de la cuota / 36000
            let interesesMensuales =  Number(Number(principal) * Number(60) * diferenciaDias) / Number(36000)
            let cuotaMensual = Number(amortizacion) + Number(comisionMensual) + mantenimientoValor + Number(interesesMensuales)
            principal -= Number(amortizacion)
            
            
            agregarFila(i, fechaTemp, diferenciaDias, amortizacion, 0, interesesMensuales, comisionMensual, cuotaMensual, principal) 
            
            fechaAnterior = fechas[i-1]
            
            totalPrincipal += Number(amortizacion)
            totalDeslizamiento += 0
            totalInteres += Number(interesesMensuales)
            totalComision += Number(comisionMensual)
            totalMontoCuotas += Number(cuotaMensual)

            totalDias += Number(diferenciaDias)
          }
        }else{

          let interesMensualFijo = 5 //equivale al porcentaje
          let cuotaMensual = calcularCuotaFija(montoPrestamo,interesMensualFijo,plazoMeses)
          principal = Number(montoPrestamo)

          for(let i = 1; i <= plazoMeses; i++){
            
            let cuotaInteres = Number(principal * (interesMensualFijo / 100))
            
            let fechaTemp = formatearFecha(fechas[i-1]);
            
           
            
            let diferenciaDias = diferenciaEnDias(fechaAnterior, fechas[i-1])



            amortizacion = Number(Number(cuotaMensual) - Number(cuotaInteres))
            principal = Number(Number(principal) - Number(amortizacion))
           
        
            agregarFila(i, fechaTemp, diferenciaDias, amortizacion, 0, cuotaInteres, 0, cuotaMensual, principal)
            fechaAnterior = fechas[i-1] 

            totalPrincipal += Number(amortizacion)
            
            totalInteres += Number(cuotaInteres)
            totalComision += 0
            totalMontoCuotas += Number(cuotaMensual)
            totalDias += Number(diferenciaDias)
            
          }
        }

        
        
        //agregar totales de todos los campos
        agregarFila("TOTALES", "", Number(totalDias).toFixed(2), Number(totalPrincipal), totalDeslizamiento, Number(totalInteres), Number(totalComision), Number(totalMontoCuotas), "") 

    })

    function agregarFila(noCuota, fecCuota, cantidadDias, cuotaPrincipal, deslizamiento, interes, comisionMensual, montoCuota, saldo) {
   
        var htmlTags = '<tr>'+
             '<td>' + noCuota + '</td>'+
             '<td>' + fecCuota + '</td>'+
             '<td>' + Number(cantidadDias) + '</td>'+
             '<td>' + Number(cuotaPrincipal).toFixed(2) + '</td>'+
             '<td>' + Number(deslizamiento).toFixed(2) + '</td>'+
             '<td>' + Number(interes).toFixed(2) + '</td>'+
             '<td>' + Number(comisionMensual).toFixed(2) + '</td>'+
             '<td>' + Number(montoCuota).toFixed(2) + '</td>'+
             '<td>' + Math.abs(Number(saldo).toFixed(2)) + '</td>'+
           '</tr>';
           
        $('#tablaCuotas').append(htmlTags);
     
     }

     // Función para obtener una lista de fechas mensuales
function obtenerFechasMensuales(iteraciones, fecha) {
  let fechas = [];
  let fechaActual = fecha;


  for (let i = 0; i < iteraciones; i++) {
      if (fechaActual.getDay() !== 0) { // Evitar fechas que caigan en domingo
          fechas.push(new Date(fechaActual));
      }else{
        //en caso que caiga domingo agregarle un dia para que caiga lunes el pago
        fechas.push(new Date(fechaActual.setDate(fechaActual.getDate() + 1)));
      }
      fechaActual.setMonth(fechaActual.getMonth() + 1);
  } 
  
  return fechas;
}

// Función para obtener una lista de fechas quincenales
function obtenerFechasQuincenales(iteraciones, fecha) {
  let cantidadDiasAgregar = 15
  let fechas = [];
  let fechaActual = fecha;
  
  
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
function obtenerFechasSemanales(iteraciones, fecha) {
  let cantidadDiasAgregar = 7
  let fechas = [];
  let fechaActual = fecha;
  

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
  const diferenciaMs = Math.abs(fecha1.getTime() - fecha2.getTime());
  return Math.ceil(diferenciaMs / unDia);
}

function calcularCuotaFija(montoPrestamo, tasaInteresMensual, plazoPago) {
  // Convertir la tasa de interés a decimal
  var tasaDecimal = tasaInteresMensual / 100;

  // Calcular la cuota fija
  var cuotaFija = montoPrestamo * (tasaDecimal * Math.pow((1 + tasaDecimal), plazoPago)) / (Math.pow((1 + tasaDecimal), plazoPago) - 1);

  // Redondear el resultado a dos decimales
  cuotaFija = cuotaFija.toFixed(2);

  return cuotaFija;
}


    

})