// Asignar eventos al cargar
document.getElementById('btn-calcular').addEventListener('click', procesarEncuesta);

// Asignar evento input a todos los campos de peso para calcular en tiempo real
const inputsPeso = document.querySelectorAll('.peso-input');
inputsPeso.forEach(input => {
    input.addEventListener('input', actualizarSumaPesos);
});

// Calcula y muestra la suma parcial de pesos
function actualizarSumaPesos() {
    let suma = 0;
    for (let i = 1; i <= 5; i++) {
        const peso = parseFloat(document.getElementById(`peso${i}`).value);
        if (!isNaN(peso)) {
            suma += peso;
        }
    }
    document.getElementById('suma-actual').textContent = `${suma}%`;
}

// Lógica principal de cálculo y validación
function procesarEncuesta() {
    const errorBox = document.getElementById('mensajes-error');
    const resultBox = document.getElementById('resultado-final');
    
    // Ocultar mensajes previos y resetear contenedor
    errorBox.className = 'hidden';
    resultBox.className = 'hidden';
    errorBox.innerHTML = '';
    
    const nombre = document.getElementById('nombre').value.trim();
    const sucursal = document.getElementById('sucursal').value.trim();

    let errores = []; // Arreglo para acumular todos los errores

    // 1. Validar campos obligatorios generales
    if (nombre === '') errores.push('El nombre del cliente es obligatorio.');
    if (sucursal === '') errores.push('La sucursal visitada es obligatoria.');

    let sumaPesos = 0;
    let satisfaccionTotal = 0;

    // 2. Recorrer y validar los 5 aspectos
    for (let i = 1; i <= 5; i++) {
        const nombreAspecto = document.getElementById(`aspecto${i}`).value.trim();
        const calificacionInput = document.getElementById(`calif${i}`).value;
        const pesoInput = document.getElementById(`peso${i}`).value;
        
        const calificacion = parseFloat(calificacionInput);
        const peso = parseFloat(pesoInput);

        // Validar nombre del aspecto
        if (nombreAspecto === '') {
            errores.push(`El nombre del aspecto ${i} no puede estar vacío.`);
        }

        // Validar calificación
        if (calificacionInput === '' || isNaN(calificacion) || calificacion < 1 || calificacion > 5) {
            errores.push(`La calificación del aspecto ${i} debe estar entre 1 y 5.`);
        }

        // Validar peso
        if (pesoInput === '' || isNaN(peso) || peso < 0 || peso > 100) {
            errores.push(`El peso del aspecto ${i} debe estar entre 0 y 100.`);
        } else {
            sumaPesos += peso;
            // Solo sumamos a la satisfacción si la calificación también es válida
            if (!isNaN(calificacion) && calificacion >= 1 && calificacion <= 5) {
                satisfaccionTotal += (calificacion * peso) / 100;
            }
        }
    }

    // 3. Validar suma total de pesos
    if (errores.length === 0 && sumaPesos !== 100) {
        errores.push(`Los pesos deben sumar 100% (actual: ${sumaPesos}%).`);
    }

    // 4. Decidir qué mostrar (Errores o Resultado)
    if (errores.length > 0) {
        mostrarErrores(errores);
    } else {
        mostrarResultado(satisfaccionTotal);
    }
}

// Función para imprimir la lista de errores
function mostrarErrores(listaErrores) {
    const errorBox = document.getElementById('mensajes-error');
    
    // Crear la estructura HTML con el título y la lista
    let htmlErrores = `<h4>Corrige los siguientes errores:</h4><ul>`;
    listaErrores.forEach(error => {
        htmlErrores += `<li>${error}</li>`;
    });
    htmlErrores += `</ul>`;
    
    errorBox.innerHTML = htmlErrores;
    errorBox.className = 'error-box'; 
}

// Función para imprimir el resultado final
function mostrarResultado(puntaje) {
    const resultBox = document.getElementById('resultado-final');
    const puntajeFormateado = puntaje.toFixed(2);
    let categoria = '';
    let claseColor = '';

    if (puntaje >= 4.5 && puntaje <= 5.0) {
        categoria = 'Cliente Promotor';
        claseColor = 'promotor';
    } else if (puntaje >= 3.5 && puntaje < 4.5) {
        categoria = 'Cliente Satisfecho';
        claseColor = 'satisfecho';
    } else if (puntaje >= 2.5 && puntaje < 3.5) {
        categoria = 'Cliente Neutral';
        claseColor = 'neutral';
    } else {
        categoria = 'Cliente Detractor';
        claseColor = 'detractor';
    }

    resultBox.innerHTML = `Satisfacción Global: ${puntajeFormateado} <br> Categoría: ${categoria}`;
    resultBox.className = claseColor; 
}