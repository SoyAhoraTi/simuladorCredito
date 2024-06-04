$(() => {

    let tasaQuincenalCantidad = 24
    let tasaMensualCantidad = 12
    let tasaSemanalCantidad = 48

    
    let tasaInteresMensual = 0
    let tasaComisionMensual = 0

    $("#calcularCuota").click(() => {

        let montoPrestamo = $("#monto").val()
        let plazoMeses = $("#plazo").val()
        var tasaInteresAnual = 0.6; // Tasa de interés anual (60% anual)
        let periodoCobro = $("#periodo_cobro").val() //string
        let mantenimientoValor = 0
        
        let tasaComisionAnual = $("#tasa_comision").val() * 0.01 //TODO pendiente de revisar
        let tipoCuota = $("#tipo_cuota").val() //string

        let principal = Number(montoPrestamo).toFixed(2)
        
        
        var fecha = new Date();
        var anyo = fecha.getFullYear();
        let mes = fecha.getMonth()

        $('#tablaCuotas').empty();
        if(periodoCobro === "mensual"){
          periodoCobro = 30
          // Convertir tasas anuales a mensuales
          tasaInteresMensual = (tasaInteresAnual / tasaMensualCantidad).toFixed(2);
          tasaComisionMensual = (tasaComisionAnual / tasaMensualCantidad).toFixed(2);
        }
        else if(periodoCobro === "quincenal"){
          plazoMeses = plazoMeses * 2
          tasaInteresMensual = (tasaInteresAnual / tasaQuincenalCantidad).toFixed(2);
          tasaComisionMensual = (tasaComisionAnual / tasaQuincenalCantidad).toFixed(2);
          periodoCobro = 15
        }else if(periodoCobro === "semanal"){
            plazoMeses = plazoMeses * 4
            tasaInteresMensual = (tasaInteresAnual / tasaSemanalCantidad).toFixed(2);
            tasaComisionMensual = (tasaComisionAnual / tasaSemanalCantidad).toFixed(2);
            periodoCobro = 7
        }

        let amortizacion = montoPrestamo / plazoMeses
        let comisionGeneral = tasaComisionAnual * montoPrestamo
        let comisionMensual = comisionGeneral / plazoMeses
        
        if (tipoCuota === "variable"){
          for(let i = 1; i <= plazoMeses; i++){
            let cantidadDias1 = obtenerCantidadDiasMesAño(anyo, mes)
            
            let interesesMensuales = ((((principal + mantenimientoValor) * tasaInteresAnual) * periodoCobro) / 360).toFixed(2)
            let cuotaMensual = (amortizacion + comisionMensual + mantenimientoValor + Number(interesesMensuales))
  
            principal -= amortizacion
            
            agregarFila(i, new Date(anyo, mes, 1), cantidadDias1, amortizacion, 0, interesesMensuales, comisionMensual, cuotaMensual, principal) 
          }
        }

        

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

     function obtenerCantidadDiasMesAño(anyo, mes){

        let diasMes = new Date(anyo, mes, 0).getDate();
        /*console.log(diasMes, mes, anyo)
        let diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado','Domingo'];
    
        for (var dia = 1; dia <= diasMes; dia++) {
          // Ojo, hay que restarle 1 para obtener el mes correcto
          var indice = new Date(anyo, mes - 1, dia).getDay();
          console.log(`El día número ${dia} del mes ${mes} del año ${anyo} es ${diasSemana[indice]}`);
    }*/
    
        return diasMes
      }

      $("#plazo").keyup(function(){
        let valor = $(this).val()
    
        if(valor >= 10){
          $("#tasa_comision").val(tasaComisionMaxima)
        }else{
          $("#tasa_comision").val(valor)
        }
        
      })

})