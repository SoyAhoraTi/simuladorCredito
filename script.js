function calcularCuota() {
    var monto = parseFloat(document.getElementById('monto').value);
    var plazo = parseInt(document.getElementById('plazo').value);
    var periodo_cobro = document.getElementById('periodo_cobro').value;
    var tasa_interes_anual = parseFloat(document.getElementById('tasa_interes').value) / 100;
    var tasa_comision = parseFloat(document.getElementById('tasa_comision').value) / 100;
    var tipo_cuota = document.getElementById('tipo_cuota').value;
  
    var tabla = document.getElementById('tabla-cuotas');
    tabla.innerHTML = '';
  
    var totalInteres = 0;
    var totalComision = 0;
    var saldo = monto;
  
    for (var i = 1; i <= plazo; i++) {
      var fila = tabla.insertRow();
      var numeroCuota = fila.insertCell(0);
      var fechaCuota = fila.insertCell(1);
      var dias = fila.insertCell(2);
      var cuotaPrincipal = fila.insertCell(3);
      var deslizamiento = fila.insertCell(4);
      var interes = fila.insertCell(5);
      var comision = fila.insertCell(6);
      var montoCuota = fila.insertCell(7);
      var saldoActual = fila.insertCell(8);
  
      numeroCuota.innerHTML = i;
  
      // Calculamos la fecha de la cuota
      var fecha = new Date();
      fecha.setMonth(fecha.getMonth() + i);
      fechaCuota.innerHTML = fecha.toLocaleDateString();
  
      // Dependiendo del periodo de cobro, calculamos los días
      if (periodo_cobro === 'mensual') {
        dias.innerHTML = 30;
      } else if (periodo_cobro === 'quincenal') {
        dias.innerHTML = 15;
      } else if (periodo_cobro === 'semanal') {
        dias.innerHTML = 7;
      }
  
      // Calculamos la parte del interés
      var interesMensual = tasa_interes_anual / 12;
      var interesCalculado = saldo * interesMensual;
      totalInteres += interesCalculado;
  
      // Calculamos la parte del principal
      var cuotaPrincipalCalculado = 0;
      if (tipo_cuota === 'nivelada') {
        cuotaPrincipalCalculado = monto / plazo;
      } else if (tipo_cuota === 'variable') {
        cuotaPrincipalCalculado = monto * (i / plazo);
      }
  
      // Calculamos la comisión
      var comisionCalculada = saldo * tasa_comision;
      totalComision += comisionCalculada;
  
      // Calculamos el monto de la cuota
      var montoCuotaCalculado = cuotaPrincipalCalculado + interesCalculado + comisionCalculada;
  
      // Actualizamos el saldo
      saldo -= cuotaPrincipalCalculado;
  
      // Mostramos los resultados en la tabla
      cuotaPrincipal.innerHTML = cuotaPrincipalCalculado.toFixed(2);
      deslizamiento.innerHTML = '-';
      interes.innerHTML = interesCalculado.toFixed(2);
      comision.innerHTML = comisionCalculada.toFixed(2);
      montoCuota.innerHTML = montoCuotaCalculado.toFixed(2);
      saldoActual.innerHTML = saldo.toFixed(2);
    }
  
    // Agregamos una fila al final para mostrar los totales
    var filaTotal = tabla.insertRow();
    var celdaTotal = filaTotal.insertCell();
    celdaTotal.colSpan = 8;
    celdaTotal.innerHTML = '<b>Total</b>';
    var celdaTotalInteres = filaTotal.insertCell();
    celdaTotalInteres.innerHTML = '<b>' + totalInteres.toFixed(2) + '</b>';
    var celdaTotalComision = filaTotal.insertCell();
    celdaTotalComision.innerHTML = '<b>' + totalComision.toFixed(2) + '</b>';
  }
  