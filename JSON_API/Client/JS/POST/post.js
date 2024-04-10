import { caricaDatiTabella } from "../GET/getall.js";
import {mostraDettagli} from "../GET/get";
import {confermaEliminazione} from "../DELETE/delete";
import {mostraModaleModifica} from "../PATCH/patch";

const serverURL = 'http://127.0.0.1:8081/products';

function inviaNuovoProdotto(nuovoProdotto) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: { attributes: nuovoProdotto } })
    };

    fetch(serverURL, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore durante l\'invio del nuovo prodotto');
            }
            return response.json();})
        .then(data => {
            const product = data.data;
            var tablebody = document.getElementById("productTableBody");
            var riga = document.createElement("tr");
            console.log(product.nome);
            riga.innerHTML =
                '<td>'+ product.id + '</td>' +
                '<td>'+ product.attributes.nome + '</td>' +
                '<td>'+ product.attributes.marca + '</td>' +
                '<td>'+ product.attributes.prezzo + '</td>' +
            <td>
                <button className="btn btn-primary show-btn">Show</button>
                <button className="btn btn-success edit-btn">Edit</button>
                <button className="btn btn-danger delete-btn" data-id="${prodotto.id}">Delete</button>
            </td>;

            tablebody.appendChild(riga);
            riga.querySelector('.show-btn').addEventListener('click', () => {
                mostraDettagli(product.id);
            });

            riga.querySelector('.delete-btn').addEventListener('click', (event) => {
                const idProdotto = event.target.dataset.id;
                confermaEliminazione(idProdotto);
            });

            riga.querySelector('.edit-btn').addEventListener('click', () => {
                const idProdotto = product.id;
                mostraModaleModifica(idProdotto); // Chiamata alla funzione per mostrare il modale di modifica
            });


        })



        .catch(error => console.error(error.message));
}

function mostraModaleInserimento() {

    const modalHTML = `
        <div class="modal fade" id="inserimentoProdottoModal" tabindex="-1" aria-labelledby="inserimentoProdottoModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="inserimentoProdottoModalLabel">Inserimento Nuovo Prodotto</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="nuovoProdottoForm">
                            <div class="mb-3">
                                <label for="nomeInput" class="form-label">Nome</label>
                                <input type="text" class="form-control" id="nomeInput" required>
                            </div>
                            <div class="mb-3">
                                <label for="marcaInput" class="form-label">Marca</label>
                                <input type="text" class="form-control" id="marcaInput" required>
                            </div>
                            <div class="mb-3">
                                <label for="prezzoInput" class="form-label">Prezzo</label>
                                <input type="number" class="form-control" id="prezzoInput" MIN="1">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                        <button type="button" class="btn btn-primary" id="salvaProdottoBtn">Salva</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = new bootstrap.Modal(document.getElementById('inserimentoProdottoModal'));
    modal.show();

    const salvaProdottoBtn = document.getElementById('salvaProdottoBtn');
    salvaProdottoBtn.addEventListener('click', salvaNuovoProdotto);
}

function salvaNuovoProdotto() {
    const nomeInput = document.getElementById('nomeInput');
    const marcaInput = document.getElementById('marcaInput');
    const prezzoInput = document.getElementById('prezzoInput');

    const nome = nomeInput.value;
    const marca = marcaInput.value;
    const prezzo = parseFloat(prezzoInput.value);

    if (nome && marca) {
        const nuovoProdotto = {
            nome: nome,
            marca: marca,
            prezzo: prezzo ? prezzo : null
        };

        inviaNuovoProdotto(nuovoProdotto);

        // Reimposta i valori delle caselle di testo a vuoti
        nomeInput.value = '';
        marcaInput.value = '';
        prezzoInput.value = '';

        // Chiudi il modale
        const modal = bootstrap.Modal.getInstance(document.getElementById('inserimentoProdottoModal'));
        modal.hide();
    } else {
        alert('Per favore, compila tutti i campi obbligatori.');
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // Aggiungi event listener al pulsante "Crea"
    const creaProdottoBtn = document.getElementById('creaProdottoBtn');
    creaProdottoBtn.addEventListener('click', mostraModaleInserimento);

});