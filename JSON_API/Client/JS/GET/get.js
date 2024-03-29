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
        <div class="modal fade" id="dettagliProdottoModal" tabindex="-1" aria-labelledby="dettagliProdottoModalLabel" aria-hidden="true">
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

    // Ottieni l'elemento del modal
    const modalElement = document.getElementById('dettagliProdottoModal');

    // Crea un observer per monitorare l'attributo aria-hidden del modal
    const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
            if (mutation.attributeName === 'aria-hidden' && modalElement.getAttribute('aria-hidden') === 'true') {
                // Rimuovi l'elemento del modal dal DOM quando viene nascosto
                modalElement.remove();
                observer.disconnect(); // Scollega l'observer dopo aver rimosso il modal
            }
        }
    });

    // Aggiungi l'observer all'elemento del modal
    observer.observe(modalElement, { attributes: true });

    // Mostra il modal
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

document.addEventListener('DOMContentLoaded', caricaDatiTabella);
