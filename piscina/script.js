// Inicializar EmailJS
emailjs.init({
    publicKey: "OcF8DqhiiE48nhbZz"
});


// ================================
// HTML ORIGINAL
// ================================

const htmlOriginal = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;background:#f7f8fa;border-radius:8px">

    <div style="padding-bottom:10px;border-bottom:2px solid #ccc">
        <div style="text-align:left">
            <img src="https://rduran23.github.io/piscina/logo.png"
                alt="Logo"
                style="width:80px">
        </div>
    </div>

    <div style="text-align:center;margin:20px 0">
        <h2 style="color:#27ae60;font-weight:bold">
            ¡Reserva confirmada!
        </h2>
    </div>

    <hr style="border:1px solid #ccc;margin:20px 0">

    <div style="text-align:center;margin-bottom:10px">
        <p style="font-size:16px;font-weight:bold;color:#2c3e50">
            Instrucciones
        </p>
    </div>

    <div style="text-align:center;margin-bottom:10px">
        <p style="list-style:none;padding:0;text-align:center;font-size:14px;color:#555">
            Presente este correo en la <span class="il">piscina</span> municipal.
            Los accesos diarios son validados directamente por el socorrista
        </p>
    </div>

    <hr style="border:1px solid #ccc;margin:20px 0">

    <div style="text-align:center;margin-bottom:10px">
        <p style="font-size:16px;font-weight:bold;color:#2c3e50">
            Detalles de la compra
        </p>
    </div>

    <ul style="list-style:none;padding:0;text-align:center;font-size:14px;color:#555">

        <li>
            <b>Instalación:</b>
            <span class="il">Piscina</span>
        </li>

        <li>
            <b>Ubicación:</b>
            <a href="https://maps.app.goo.gl/m6r5HizpzVaef1ym9"
               style="color:#007bff;text-decoration:none"
               target="_blank">
                Ver mapa
            </a>
        </li>

        <li style="font-size:16px">
            <b style="color:#2c3e50">Tipo acceso:</b>
            <span style="color:#27ae60;font-weight:bold">
                Acceso diario
            </span>
        </li>

        <li style="font-size:16px">
            <b style="color:#2c3e50">Fecha inicio:</b>
            <span style="color:#27ae60;font-weight:bold">
                {{fecha}}
            </span>
        </li>

        <li>
            <b>Precio:</b>
            2 €
        </li>

    </ul>

    <div style="text-align:center;margin-bottom:10px">
        <p style="font-size:16px;font-weight:bold;color:#2c3e50">
            Detalles del comprador
        </p>
    </div>

    <ul style="list-style:none;padding:0;text-align:center;font-size:14px;color:#555">

        <li>
            <b>Nombre:</b> {{nombre}}
        </li>

        <li>
            <b>Email:</b>
            <a href="mailto:{{email}}" target="_blank">
                {{email}}
            </a>
        </li>

        <li>
            <b>DNI:</b> {{dni}}
        </li>

        <li>
            <b>Teléfono:</b> {{telefono}}
        </li>

    </ul>

    <div style="margin-top:20px;padding-top:10px;font-size:12px;color:#888;text-align:center;border-top:1px solid #ccc">

        <p>Este es un correo automático, por favor no respondas.</p>

        <p>
            <a href="https://www.benimuslem.es/"
               style="color:#007bff;text-decoration:none"
               target="_blank">
                Ajuntament de Benimuslem
            </a>
        </p>

        <p>Carrer Nou d'Octurbre, 3, 46711 - 962 81 88 51</p>

        <p>
            <a href="mailto:ayuntamiento@benimuslem.es"
               target="_blank">
                ayuntamiento@benimuslem.es
            </a>
        </p>

    </div>

</div>
`;


// ================================
// FECHA ACTUAL
// ================================

function obtenerFechaActual() {

    const ahora = new Date();

    let fecha = ahora.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    return fecha.charAt(0).toUpperCase() + fecha.slice(1);
}


// ================================
// ESCAPAR HTML
// ================================

function escaparHTML(texto) {

    const div = document.createElement("div");
    div.textContent = texto;

    return div.innerHTML;
}


// ================================
// FORMULARIO
// ================================

document
    .getElementById("formulario")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const nombre = document
            .getElementById("nombre")
            .value
            .trim();

        const email = document
            .getElementById("email")
            .value
            .trim();

        const dni = document
            .getElementById("dni")
            .value
            .trim()
            .toUpperCase();

        const telefono = document
            .getElementById("telefono")
            .value
            .trim();

        const status = document.getElementById("status");
        const boton = document.querySelector(
            "button[type='submit']"
        );


        // Validación

        if (!nombre || !email || !dni || !telefono) {

            status.textContent =
                "❌ Completa todos los campos.";

            status.style.color = "#e74c3c";

            return;
        }


        // ================================
        // GENERAR HTML PERSONALIZADO
        // ================================

        const htmlPersonalizado = htmlOriginal

            .replaceAll(
                "{{nombre}}",
                escaparHTML(nombre)
            )

            .replaceAll(
                "{{email}}",
                escaparHTML(email)
            )

            .replaceAll(
                "{{dni}}",
                escaparHTML(dni)
            )

            .replaceAll(
                "{{telefono}}",
                escaparHTML(telefono)
            )

            .replaceAll(
                "{{fecha}}",
                obtenerFechaActual()
            );


        // ================================
        // ENVIAR CON EMAILJS
        // ================================

        boton.disabled = true;
        boton.textContent = "Enviando...";

        status.textContent = "";


        try {

            await emailjs.send(

                "service_clth8bq",

                "template_j2bkfzl",

                {
                    nombre: nombre,
                    email: email,
                    dni: dni,
                    telefono: telefono,

                    fecha: obtenerFechaActual(),

                    html_code: htmlPersonalizado
                }

            );


            status.textContent =
                "✅ Correo enviado correctamente.";

            status.style.color = "#27ae60";

            document
                .getElementById("formulario")
                .reset();


        } catch (error) {

            console.error(
                "Error de EmailJS:",
                error
            );

            status.textContent =
                "❌ Error al enviar el correo.";

            status.style.color = "#e74c3c";

        }


        boton.disabled = false;
        boton.textContent = "Enviar correo";

    });
