import {mostraDettagli} from "../GET/get.js";
import {confermaEliminazione} from "../DELETE/delete.js";
import {mostraModaleModifica} from "../PATCH/patch.js";

const serverURL = 'http://127.0.0.1:8081/products';

function inviaNuovoProdotto(nuovoProdotto) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({data: {attributes: nuovoProdotto}})
    };

    fetch(serverURL, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore durante l\'invio del nuovo prodotto');
            }
            return response.json();
        })
        .then(data => {
            console.log('Prodotto inviato con successo:', data);
            const product = data.data;
            var tablebody = document.getElementById("productTableBody");
            var riga = document.createElement("tr");
            riga.innerHTML = `
                     <td>${product.id}</td>
                     <td>${product.attributes.nome}</td>
                     <td>${product.attributes.marca}</td>
                     <td>${product.attributes.prezzo}</td>
                <td>
                    <button class="btn btn-dark show-btn">Show</button>
                    <button class="btn btn-dark edit-btn">Edit</button>
                     <button class="btn btn-dark delete-btn" data-id="${product.id}">Delete</button>
    </td>
`;
            riga.id = `row-${product.id}`;
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
        });
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
                                <label for="nuovoNomeInput" class="form-label">Nome</label>
                                <input type="text" class="form-control" id="nuovoNomeInput" required>
                            </div>
                            <div class="mb-3">
                                <label for="nuovoMarcaInput" class="form-label">Marca</label>
                                <input type="text" class="form-control" id="nuovoMarcaInput" required>
                            </div>
                            <div class="mb-3">
                                <label for="nuovoPrezzoInput" class="form-label">Prezzo</label>
                                <input type="number" class="form-control" id="nuovoPrezzoInput" min="1">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-dark" data-bs-dismiss="modal">Annulla</button>
                        <button type="button" class="btn btn-dark" id="salvaProdottoBtn">Salva</button>
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
    const nomeInput = document.getElementById('nuovoNomeInput');
    const marcaInput = document.getElementById('nuovoMarcaInput');
    const prezzoInput = document.getElementById('nuovoPrezzoInput');

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

document.addEventListener('DOMContentLoaded', function () {
    const creaProdottoBtn = document.getElementById('creaProdottoBtn');
    creaProdottoBtn.addEventListener('click', mostraModaleInserimento);
});