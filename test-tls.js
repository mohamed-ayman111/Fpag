const tls = require("tls");

const socket = tls.connect({
    host: "smtp.gmail.com",
    port: 587,
    servername: "smtp.gmail.com",
    family: 4
}, () => {

    console.log("TLS connected");

    console.log("Authorized:", socket.authorized);

    console.log(
        "Authorization error:",
        socket.authorizationError
    );

    console.log("Certificate:");

    console.log(socket.getPeerCertificate());

    socket.end();
});

socket.on("error", (error) => {

    console.error("TLS error:");
    console.error(error);

});