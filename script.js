// Configuración de acceso
const VALID_USERNAME = 'jair';  // Cambia esto al usuario deseado
const VALID_PASSWORD = '12345678';  // Cambia esto a la contraseña deseada

// Configuración de ThinkSpeak
const CHANNEL_ID = 2572201;  // ID del canal
const READ_KEY = 'LGMM8ZYHFLG73O59';  // Clave de lectura
const READ_URL = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${READ_KEY}&results=1`;

// Intervalo de actualización (en milisegundos)
const UPDATE_INTERVAL = 10000; // 10 segundos

let updateIntervalId;

// Función de inicio de sesión
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('loginError');

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('dataContainer').style.display = 'block';
        obtenerDatos();
        updateIntervalId = setInterval(obtenerDatos, UPDATE_INTERVAL);
    } else {
        loginError.textContent = 'Usuario o contraseña incorrectos';
    }
}

// Función para cerrar sesión
function logout() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('dataContainer').style.display = 'none';
    document.getElementById('loginError').textContent = '';
    clearInterval(updateIntervalId);
}

// Función para obtener datos
async function obtenerDatos() {
    try {
        const response = await fetch(READ_URL);
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const data = await response.json();
        const feeds = data.feeds;

        if (feeds.length > 0) {
            const ultimoFeed = feeds[0];  // Obtener el último feed
            const temperature = ultimoFeed.field1;
            const humidity = ultimoFeed.field2;

            document.getElementById('temperature').innerHTML = `<i class="fas fa-thermometer-half"></i> <span>Temperatura: ${temperature} °F</span>`;
            document.getElementById('humidity').innerHTML = `<i class="fas fa-tint"></i> <span>Humedad: ${humidity} %</span>`;
        } else {
            document.getElementById('temperature').innerHTML = '<i class="fas fa-thermometer-half"></i> <span>Temperatura: No disponible</span>';
            document.getElementById('humidity').innerHTML = '<i class="fas fa-tint"></i> <span>Humedad: No disponible</span>';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('temperature').innerHTML = '<i class="fas fa-thermometer-half"></i> <span>Temperatura: Error</span>';
        document.getElementById('humidity').innerHTML = '<i class="fas fa-tint"></i> <span>Humedad: Error</span>';
    }
}
