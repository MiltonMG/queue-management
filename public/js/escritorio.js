
//Referencias
const lblPendientes = document.querySelector('#lblPendientes');
const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');


const searchParams = new URLSearchParams( window.location.search ); //URLSearchParams nos proporciona unos muy útiles métodos para poder saber si un parámetro está en la URL

//Verificamos q en la url este la query escritorio
//si escritorio no esta lo regresamos al index
if ( !searchParams.has('escritorio') ) { 

    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;
divAlerta.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    // console.log('Conectado');
    btnAtender.disabled = false;    

});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    btnAtender.disabled = true;    
});

socket.on('ultimo-ticket', (payload) => {
    // lblNuevoTicket.innerText = 'Ticket '+payload
});

socket.on('tickets-pendientes', (payload) => {
    lblPendientes.innerText = payload;
});


btnAtender.addEventListener( 'click', () => {
    
    socket.emit( 'atender-ticket', {escritorio}, ( {ok, ticket, msg, pendientes} ) => {
        
        if (!ok) {
            lblTicket.innerText = `Nadie.` 
            return divAlerta.style.display = '';
        } 

        lblTicket.innerText = `Ticket ` + ticket.numero
        lblPendientes.innerText = pendientes;
        
    });

    socket.emit( 'tickets-pendientes', parseInt(lblPendientes.textContent));

});