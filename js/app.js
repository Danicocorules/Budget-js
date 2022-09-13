// Variables y Selectores
const budgetIn = document.querySelector('#budgetUser');
const budgetForm = document.querySelector('#add-budget');
const budgetSection = document.querySelector('.intro-precio');
const originalBudget = document.querySelector('#original-budget');
const remainingBudget = document.querySelector('#remaining-budget');
const formBudget = document.querySelector('#agregar-gasto');
const billList = document.querySelector('#bills ul');

// Eventos
budgetIn.addEventListener('blur', getBudget );
formBudget.addEventListener('submit', newBill);

// Clases
class Budget {
    constructor( budget, remainingBudget ) {
        this.budget = budget;
        this.remainingBudget = remainingBudget;
        this.bills = [];
    }

    addBill( bill ) {
        this.bills = [ ...this.bills, bill ];
    }

    calcRemaining() {
        const spent = this.bills.reduce( ( total, acc ) => total + acc.billAmount, 0 );
        this.remainingBudget = this.budget - spent;
        ui.updateRemaining( this.remainingBudget );
    }
}

class Ui {

    insertInitialBudget( value ) {
        const budgetBox = document.createElement('p');
        budgetBox.classList.add('actual','budget');
        budgetBox.textContent = `Your original budget is: `;

        const budgetValue = document.createElement('span');
        budgetValue.id = 'total';
        budgetValue.textContent = value;

        originalBudget.appendChild(budgetBox);
        budgetBox.appendChild(budgetValue);
    }

    insertRemBudget( value ) {
        const budgetRestBox = document.createElement('p');
        budgetRestBox.classList.add('remaning','budget');
        budgetRestBox.textContent = `Your actual budget is: `;
    
        const budgetRest = document.createElement('span');
        budgetRest.id = 'budgetRest';
        budgetRest.textContent = value;
    
        remainingBudget.appendChild(budgetRestBox);
        budgetRestBox.appendChild(budgetRest);
    }
    
    updateRemaining( value ) {
        let remaning = document.querySelector('#budgetRest');
        remaning.value = value;
        remaning.textContent = value;
    }
}

let budget;
let ui;

// Funciones
function getBudget() {

    let budgetUser = budgetIn.value;

    if ( budgetUser === '' ) {
        errorBudget('Fill in the budget');
        return;
    }
    const validBudge = Number( budgetUser );
    if ( isNaN(validBudge) || validBudge < 0 ) {
        errorBudget('Your budget must be at least $10.');
        budgetForm.reset();
        return;
    }
    budgetSection.remove();

    budget = new Budget(validBudge, validBudge);
    ui = new Ui;
    ui.insertInitialBudget( validBudge );
    ui.insertRemBudget( validBudge);
}

function newBill(e) {
    e.preventDefault();

    const billName = document.querySelector('#bill-name').value;
    const billAmount = Number(document.querySelector('#bill-amount').value);

    if ( billName === '' || billAmount === '') {
        errorBill('All fields must be filled ');
        return;
    }
    if( billAmount < 0 || isNaN(billAmount)) {
        errorBill('The expense must be greater than 0');
        return;
    }

    const bill = { billName, billAmount, id: Date.now() }
    budget.addBill(bill);
    budget.calcRemaining();
    printsBillsHTML();
    formBudget.reset();
}

function printsBillsHTML() {

    cleanHTML();
    budget.bills.forEach( bill => {

        const { billAmount, billName, id } = bill;

        const newBillBox = document.createElement('li');
        newBillBox.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        newBillBox.dataset.id = id;

        newBillBox.innerHTML = `${billName} <span>${billAmount}$</span>`
        
        const btnDelete = document.createElement('button');
        btnDelete.classList.add('btn', 'btn-danger', 'delete-bill');
        btnDelete.textContent = "Delete"

        newBillBox.appendChild(btnDelete);
        billList.appendChild(newBillBox);
    });
}

function cleanHTML() {
    while( billList.firstChild ) {
        billList.removeChild( billList.firstChild);
    }
}

function errorBill( msg ) {
    let errorMsg = document.createElement('p');
    errorMsg.classList.add('alert','alert-danger')
    errorMsg.textContent = msg;

    formBudget.appendChild(errorMsg)
    setTimeout(() => {
        errorMsg.remove();
    }, 1000);
}

function errorBudget( msg ) {
    let errorMsg = document.createElement('p');
    errorMsg.classList.add('alert','alert-danger')
    errorMsg.textContent = msg;
    budgetForm.appendChild(errorMsg);
    
    setTimeout(() => {
        errorMsg.remove();
    }, 1000);
}





































// // VARIABLES
// const presuForm = document.querySelector( '#presu' );
// const formulario = document.querySelector('#agregar-gasto');
// const listaGastos = document.querySelector('#gastos ul');

// // EVENTS
// iniciarEventos();
// function iniciarEventos() {
//     presuForm.addEventListener( 'blur', verificarPresupuesto );
//     formulario.addEventListener( 'submit', agregarGasto );
// }

// // CLASS
// class PresupuestoGestion {
//     constructor( presupuesto ) {
//         this.presupuesto = presupuesto;
//         this.restante = presupuesto;
//         this.gastos = [];
//     }

//     nuevoGasto( gasto ) {
//         this.gastos = [ ...this.gastos, gasto ];
//         this.calcularGasto();
//     }

//     calcularGasto() {
//         const gastado = this.gastos.reduce( (acc, gasto ) => acc + gasto.cantidad ,0 );
//         this.restante = this.presupuesto - gastado;
//     }
//     eliminarGasto(id) {
//         this.gastos = this.gastos.filter( gasto => gasto.id !== Number(id) );
//         gastoRestante(this.gastos);
//         this.calcularGasto();
//     }
// }

// class UI {
//     insertarPresupuesto( cantidad ) {
//         let { presupuesto, restante } = cantidad;
//         document.querySelector( '#total' ).textContent = presupuesto;
//         document.querySelector( '#restante' ).textContent = restante;
//     }

//     imprimirAlerta( mensaje ) {
//         let divMensaje = document.createElement('div');
//         divMensaje.classList.add('text-center','alert');
//         divMensaje.classList.add('alert-danger');
//         document.querySelector('.primario').insertBefore(divMensaje, formulario);

//         switch(mensaje) {
//             case 'Campos vacíos':
//                 divMensaje.textContent = 'Se han de llenar todos los campos.'
//                 break;
            
//             case 'Cantidad Incorrecta':
//                 divMensaje.textContent = 'Cantidad no valida';
//                 break;
        
//             case 'Gasto Correcto':
//                 divMensaje.textContent = 'Gasto Correcto';
//                 divMensaje.classList.remove('alert-danger');
//                 divMensaje.classList.add('alert-success');
//                 break;
            
//             case 'Presupuesto agotado':
//                 divMensaje.textContent = 'Se ha agotado el presupuesto';
//                 break;
//             }

//         if (mensaje === 'Campos vacíos') {
//             divMensaje.classList.add('alert-danger');
//             divMensaje.textContent = 'Se han de llenar todos los campos.'
//             document.querySelector('.primario').insertBefore(divMensaje, formulario);
//         }       
//         setTimeout( () => {
//             divMensaje.remove();
//         }, 1000 );
//     }

//     mostrarHTML ( gastos ) {
        
//         this.limpiarHTML();

//         gastos.forEach( gasto => {

//             const { concepto, cantidad, id } = gasto;

//             let liGasto = document.createElement('li');
//             liGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
//             liGasto.dataset.id = id;
            
//             liGasto.innerHTML = `${concepto}
//                 <span class="badge badge-primary badge-pill">$ ${cantidad}</span>`;

//             const btnBorrar = document.createElement('button');
//             btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
//             btnBorrar.textContent = 'Borrar';
//             btnBorrar.onclick = () => {
//                 presu.eliminarGasto(liGasto.dataset.id);
//             };
//             liGasto.appendChild(btnBorrar);

//             listaGastos.appendChild(liGasto);
//         });
//     }

//     actualizarRestante(restante, presupuesto) {
//         document.querySelector( '#restante' ).textContent = restante;
        
//         const restanteBox = document.querySelector( '.restante' );

//         if( restante <= (presupuesto / 4) ) {
//             restanteBox.classList.remove('alert-success', 'alert-warning');
//             restanteBox.classList.add('alert-danger');

//         } else if ( restante <= (presupuesto / 2) ) {
//             restanteBox.classList.remove('alert-success', 'alert-warning');
//             restanteBox.classList.add('alert-warning');
//         }

//         if ( restante < 0 ) {
//             ui.imprimirAlerta('Presupuesto agotado');
//             formulario.querySelector('button[type=submit]').disabled = true;;
//         }
//     }
    
//     limpiarHTML() {
//         while (listaGastos.firstChild) {
//             listaGastos.removeChild(listaGastos.firstChild);
//         }
//     }
// }

// const ui = new UI();
// let presu;

// // FUNCTIONS
// function verificarPresupuesto(e) {
//     let presuUsuario = parseFloat(e.target.value);
    
//     if ( presuUsuario === '' || isNaN(presuUsuario) || presuUsuario <= 0  ) {
//         // TO DO --> que pasa si no pasa la comprobación?
//     } 
//     presu = new PresupuestoGestion( presuUsuario );
//     ui.insertarPresupuesto(presu);
// }

// function agregarGasto(e) {
//     e.preventDefault();

//     //Leemos el formulario
//     let concepto = document.querySelector('#gasto').value;
//     let cantidad = document.querySelector('#cantidad').value;

//     //Validamos el form
//     if (concepto === '' || cantidad === '') {
//         ui.imprimirAlerta('Campos vacíos');
//         return;
//     } else if ( cantidad <= 0 || isNaN(cantidad) ) {
//         ui.imprimirAlerta('Cantidad Incorrecta');
//         return;
//     }
    
//     const gasto = {
//         concepto: concepto,
//         cantidad: Number(cantidad),
//         id: Date.now()
//     }
    
//     presu.nuevoGasto(gasto);

//     ui.imprimirAlerta('Gasto Correcto');
    
//     const { gastos, restante, presupuesto } = presu; 
//     ui.mostrarHTML(gastos);
//     ui.actualizarRestante(restante, presupuesto);

//     formulario.reset();
// }

// function gastoRestante( gasto ) {
//     ui.mostrarHTML( gasto );


// }