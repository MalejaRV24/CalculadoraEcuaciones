document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("procesar").addEventListener("click", procesarDatos);
});

function calcularY(x, a, b, c, d, e) {
    if (!isFinite(x)) return 0; // Evitar valores inválidos
    if (Math.abs(x + 1) < 1e-5) return 0; // Evitar división por cero

    let sqrt1 = Math.sqrt(Math.abs(x - c)) + 1;
    let sqrt2 = Math.sqrt(Math.abs(x - e)) + 1;
    let denom3 = Math.abs(x + 1) < 1e-10 ? 1e-10 : (x + 1);

    let term1 = (Math.sin(a * x) + Math.cos(b * x)) / sqrt1;
    let term2 = (Math.cos(d * x) - Math.sin(e * x)) / sqrt2;
    let term3 = (Math.sin(x) * Math.cos(x)) / denom3;

    return Math.max(-20, Math.min(20, term1 + term2 + term3));
}

function procesarDatos() {
    let a = parseFloat(document.getElementById("a").value) || 0;
    let b = parseFloat(document.getElementById("b").value) || 0;
    let c = parseFloat(document.getElementById("c").value) || 0;
    let d = parseFloat(document.getElementById("d").value) || 0;
    let e = parseFloat(document.getElementById("e").value) || 0;
    let xMin = parseFloat(document.getElementById("xMin").value) || -10;
    let xMax = parseFloat(document.getElementById("xMax").value) || 10;

    if (isNaN(xMin) || isNaN(xMax) || xMax <= xMin) {
        alert("Ingrese valores válidos para X min y X max (X max debe ser mayor).");
        return;
    }

    let coeficientes = [a, b, c, d, e];
    if (coeficientes.some(isNaN)) {
    alert("Ingrese valores numéricos válidos para los coeficientes.");
    return;
    }



    let valores = [];
    let minY = Infinity, maxY = -Infinity;
    let cortesX = [];
    let paso = 0.1;

    let yAnt = calcularY(xMin, a, b, c, d, e);
    for (let x = xMin; x <= xMax; x += paso) {
        let y = calcularY(x, a, b, c, d, e);
        valores.push({ x, y });

        if (y < minY) minY = y;
        if (y > maxY) maxY = y;

        // Detección de corte en X (cambio de signo)
        if (yAnt * y < 0) { 
            let xCorte = x - paso / 2; // Aproximación de la raíz
            cortesX.push(xCorte.toFixed(4));
        }

        yAnt = y;
    }

    document.getElementById("minY").innerText = minY.toFixed(4);
    document.getElementById("maxY").innerText = maxY.toFixed(4);
    document.getElementById("cortesX").innerText = cortesX.length > 0 ? cortesX.join(", ") : "Ninguno";
    document.getElementById("totalCortes").innerText = cortesX.length;

    let tabla = document.querySelector("#tablaValores tbody");
    tabla.innerHTML = valores.map(v => `<tr><td>${v.x.toFixed(2)}</td><td>${v.y.toFixed(4)}</td></tr>`).join("");

    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(() => {
        let data = new google.visualization.DataTable();
        data.addColumn('number', 'X');
        data.addColumn('number', 'Y');
        valores.forEach(v => data.addRow([v.x, v.y]));
        let chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, { title: 'Gráfico de la función', legend: 'none' });
    });
}
