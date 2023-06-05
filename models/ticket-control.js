const path = require('path');
const fs = require('fs');

class Ticket {//Forma general de un ticket

    constructor( numero, escritorio ) {
        this.numero = numero;
        this.escritorio = escritorio;
    }

}


class TicketControl {

    constructor() {
        //Propiedades que vamos a ocupar

        this.ultimo = 0;//ultimo ticket que estamos atendiendo, este ira incrementando
        this.hoy = new Date().getDate(); //dia de ahora
        this.tickets = []; //tods los tickets pendientes
        this.ultimos4 = []; //los ultimos 4 tickets pendientes para mostrar en pantalla principal

        this.init();
        
    }

    get toJSON() { 
        //Retornamos los datos actuales del controlador de tickets
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4,
        }
    }

    /**
     * El init nos srvira para iniciar los tickets
     * 
     * verificamos si la ultima grabacion en el BD es del dia de ahora
     * si lo es, recuperamos los tickets guardados en la bd y los colocamos en las propiedades de la clase
     * 
     * sino, inicializamos todo para comenzar un nuevo dia
     */
    init() {
        const { hoy, tickets, ultimo, ultimos4 } = require("../db/data.json");
        
        if (hoy === this.hoy) { // mismo dia
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimos4 = ultimos4;
        }else{ //Es otro dia
            this.guardarDB();
        }

    }

    guardarDB() {//Guardamos en el data.json

        const dbPath = path.join(__dirname, '../db/data.json');
        fs.writeFileSync( dbPath, JSON.stringify( this.toJSON ) );

    }

    siguiente() {//Siguiente ticket
        this.ultimo += 1;//Acumulamos un ticket mas en la cuenta

        const ticket = new Ticket(this.ultimo, null);//Creamos un nuevo ticket, como argumentos enviamos el numero de ticket que es y como escritorio null por q aun no tiene un escritorio q lo atienda


        this.tickets.push( ticket ); //agregamos el ultim ticket creado al array de tickets

        this.guardarDB();

        return 'Ticket '+this.ultimo;
    }


    //Logica para atender a un ticket en un escritorio
    atenderTicket( escritorio ) {

        //Si no tenemos tickets
        if (this.tickets.length === 0) {
            return null;
        }

        const ticket =  this.tickets.shift(); //este metodo borra y retorna el primer ticket
        
        //le asignamos escritorio al ticket
        ticket.escritorio = escritorio;

        //agregamos al inicio del array 'ultimos4' el nuevo ticket
        this.ultimos4.unshift( ticket );

        //Borramos el ultimo dato del arreglo para que siempre se mantenga en 4
        if (this.ultimos4.length > 4) {

            //splice, remueve elementos por poscion y los retorna 
            this.ultimos4.splice(-1,1); //le indicamos q inicie en la ultima posicion (-1) y que remueva solo uno (1)
        }

        this.guardarDB();

        return ticket;

    }



}

module.exports = TicketControl;
