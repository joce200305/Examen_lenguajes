const crearArbol = () => {
    const expresion = document.getElementById("expresion").value;

   
    const numerosNegativos = /(?<!\d)-\d+/g; 
    if (numerosNegativos.test(expresion)) {
        mostrarMensaje("No se permiten números negativos en la expresión.");
        return;
    }

    ocultarMensaje();
    const arbol = construirArbolDesdeExpresion(expresion);
    mostrarEnPantalla(arbol);
    mostrarRecorridos(arbol);
};

const mostrarMensaje = (mensaje) => {
    const mensajeDiv = document.getElementById('error');
    mensajeDiv.innerText = mensaje;
    mensajeDiv.style.display = 'block';
};

const ocultarMensaje = () => {
    const mensajeDiv = document.getElementById('error');
    mensajeDiv.innerText = '';
    mensajeDiv.style.display = 'none';
};

const construirArbolDesdeExpresion = (expresion) => {
    const componentes = dividirEnComponentes(expresion);
    return construirArbol(componentes);
};

const dividirEnComponentes = (expresion) => {
    return expresion.match(/([A-Za-z0-9]+|[()+\-*/])/g) || [];
};

const construirArbol = (componentes) => {
    const pilaValores = [];
    const pilaOperadores = [];
    const prioridades = { '+': 1, '-': 1, '*': 2, '/': 2 };

    componentes.forEach(componente => {
        if (/[A-Za-z0-9]/.test(componente)) {
            pilaValores.push({ valor: componente, hijos: [] });
        } else if (componente === '(') {
            pilaOperadores.push(componente);
        } else if (componente === ')') {
            while (pilaOperadores.length && pilaOperadores[pilaOperadores.length - 1] !== '(') {
                aplicarOperador();
            }
            pilaOperadores.pop(); // Eliminar '('
        } else if (/[\+\-\*\/]/.test(componente)) {
            while (pilaOperadores.length && prioridades[pilaOperadores[pilaOperadores.length - 1]] >= prioridades[componente]) {
                aplicarOperador();
            }
            pilaOperadores.push(componente);
        }
    });

    while (pilaOperadores.length) {
        aplicarOperador();
    }

    return pilaValores[0];

    function aplicarOperador() {
        const operador = pilaOperadores.pop();
        const derecho = pilaValores.pop();
        const izquierdo = pilaValores.pop();
        pilaValores.push({ valor: operador, hijos: [izquierdo, derecho] });
    }
};


const mostrarEnPantalla = (nodo) => {
    const arbolDiv = document.getElementById("arbol");
    arbolDiv.innerHTML = "";

    const generarHTML = (nodo) => {
        if (!nodo) return '';
        let html = `<div class="nodo-contenedor"><div class="nodo">${nodo.valor}</div>`;
        if (nodo.hijos && nodo.hijos.length > 0) {
            html += '<div class="nodo-hijos">';
            nodo.hijos.forEach(hijo => {
                html += generarHTML(hijo);
            });
            html += '</div>';
        }
        html += '</div>';
        return html;
    };

    arbolDiv.innerHTML = generarHTML(nodo);
};

const mostrarRecorridos = (arbol) => {
    const preorden = [];
    const inorden = [];
    const postorden = [];

    const recorrerPreorden = (nodo) => {
        if (!nodo) return;
        preorden.push(nodo.valor);
        nodo.hijos.forEach(hijo => recorrerPreorden(hijo));
    };

    const recorrerInorden = (nodo) => {
        if (!nodo) return;
        if (nodo.hijos.length > 0) recorrerInorden(nodo.hijos[0]);
        inorden.push(nodo.valor);
        if (nodo.hijos.length > 1) recorrerInorden(nodo.hijos[1]);
    };

    const recorrerPostorden = (nodo) => {
        if (!nodo) return;
        nodo.hijos.forEach(hijo => recorrerPostorden(hijo));
        postorden.push(nodo.valor);
    };

    recorrerPreorden(arbol);
    recorrerInorden(arbol);
    recorrerPostorden(arbol);

    document.getElementById("preorden").innerText = "Preorden: " + preorden.join(", ");
    document.getElementById("inorden").innerText = "Inorden: " + inorden.join(", ");
    document.getElementById("postorden").innerText = "Postorden: " + postorden.join(", ");
};
