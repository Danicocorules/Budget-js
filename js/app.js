// Variables y Selectores
const budgetIn = document.querySelector('#budgetUser');
const budgetForm = document.querySelector('#add-budget');
const budgetSection = document.querySelector('.intro-precio');
const originalBudget = document.querySelector('#original-budget');
const remaningBudget = document.querySelector('#remaning-budget');
const formBudget = document.querySelector('#agregar-gasto');
const billList = document.querySelector('#bills ul');
const addBtn = document.querySelector('#add-btn');
const deleteBtn = document.querySelector('.delete-bill');

// Eventos
budgetIn.addEventListener('blur', getBudget );
formBudget.addEventListener('submit', newBill);

// Clases
class Budget {
    constructor( budget, remaningBudget ) {
        this.budget = budget;
        this.remaningBudget = remaningBudget;
        this.bills = [];
    }

    addBill( bill ) {
        this.bills = [ ...this.bills, bill ];
        ui.emptyBillMsg();
        // ToDo - Eliminar msg y que aparezca si es necesario
    }

    calcRemaning() {
        const spent = this.bills.reduce( ( total, acc ) => total + acc.billAmount, 0 );
        this.remaningBudget = this.budget - spent;
        ui.updateRemaning( this.remaningBudget );
        ui.calcRemaning();
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
    
        remaningBudget.appendChild(budgetRestBox);
        budgetRestBox.appendChild(budgetRest);
    }
    
    updateRemaning( value ) {
        let remaning = document.querySelector('#budgetRest');
        remaning.value = value;
        remaning.textContent = value;
    }

    emptyBillMsg() {
        const msg = document.querySelector('#bills p');

        if ( budget.bills.length === 1 ) {
            msg.remove();
            return;
        };

        if ( budget.bills.length === 0  ) {
            // ToDo - Hacer aparecer el msg
        }
    }

    calcRemaning() {
        const remaning = budget.remaningBudget;

        if ( remaning < 0 ) {
            document.querySelector('p.budget.remaning').classList.add('negative');       

            const negativeBudgetMsg = document.createElement('p');
            negativeBudgetMsg.textContent = 'You are in negative, you have to delete some expense to add another.';
            negativeBudgetMsg.classList.add('msg-negative')

            const msgPos = document.querySelector('.secundario');
            msgPos.insertBefore(negativeBudgetMsg, msgPos.children[1] );

            // Desabilitamos el formulario
            addBtn.disabled = true;
        } 

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
    budget.calcRemaning();
    printsBillsHTML();
    formBudget.reset();
}

function deleteBill() {
    console.log('asd');
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