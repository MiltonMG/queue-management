const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {

    //Estos emit, se emiten cuando un nuevo cliente se conecta
    socket.emit( 'ultimo-ticket', ticketControl.ultimo );
    socket.emit('estado-actual', ticketControl.ultimos4);
    socket.emit('tickets-pendientes', ticketControl.tickets.length);

    //'tickets-pendientes', ticketControl.tickets.length

    socket.on('tickets-pendientes', (  ) => {
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
    })

    socket.on('siguiente-ticket', ( payload, callback ) => {
    
        const siguiente = ticketControl.siguiente();
        callback( siguiente );

        //TODO: notificar que hay un nuevo ticket pendiente de asignar

        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
        
    })

    socket.on('atender-ticket', ({ escritorio }, callback) => {
        if (!escritorio) {
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            }) 
        }

        const ticket = ticketControl.atenderTicket( escritorio );

        //TODO: Notificar cambio en los ultimos 4
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);

        if (!ticket) {
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            })
        }else{
            callback({
                ok: true,
                ticket,
                pendientes: ticketControl.tickets.length
            })
        }

    })

}



module.exports = {
    socketController
}

