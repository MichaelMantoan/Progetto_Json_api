import { caricaDatiTabella } from "./getall.js";

const serverURL = 'http://127.0.0.1:8081/products';

export function mostraDettagli(id) {
    fetch(`${serverURL}/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore durante il recupero dei dettagli del prodotto');
            }
            return response.json();
        })
        .then(data => {
            const prodotto = data.data;
            mostraModal(prodotto);
        })
        .catch(error => console.error(error.message));
}

function mostraModal(prodotto) {
    const modalHTML = `
        <div class="modal fade" id="dettagliProdottoModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="dettagliProdottoModalLabel">Dettagli Prodotto</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p><strong>ID:</strong> ${prodotto.id}</p>
                        <p><strong>Nome:</strong> ${prodotto.attributes.nome}</p>
                        <p><strong>Marca:</strong> ${prodotto.attributes.marca}</p>
                        <p><strong>Prezzo:</strong> ${prodotto.attributes.prezzo}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Inserisci il modalHTML nel body del documento
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Mostra il modal
    const modal = new bootstrap.Modal(document.getElementById('dettagliProdottoModal'));
    modal.show();

    // Rimuovi l'elemento del modal dal DOM quando viene chiuso
    modal._element.addEventListener('hidden.bs.modal', function (event) {
        modal._element.remove();
    });
}

document.addEventListener('DOMContentLoaded', caricaDatiTabella);
