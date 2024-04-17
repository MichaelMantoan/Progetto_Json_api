
const serverURL = 'http://127.0.0.1:8081/products';

export function inviaModificheProdotto(idProdotto, modifiche) {
    const requestOptions = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: { attributes: modifiche } })
    };

    fetch(`${serverURL}/${idProdotto}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore durante l\'invio delle modifiche del prodotto');
            }
            return response.json();
        })
        .then(data => {
            console.log('Modifiche inviate con successo:', data);

        })
        .catch(error => console.error(error.message));
}

function modificaRigaTabella(idProdotto, modifiche) {
    const riga = document.getElementById(`row-${idProdotto}`);
    if (riga) {
        // Modifica i dati della riga con le modifiche ricevute
        riga.cells[1].innerText = modifiche.nome;
        riga.cells[2].innerText = modifiche.marca;
        riga.cells[3].innerText = modifiche.prezzo;

    } else {
        console.error('Riga non trovata nella tabella');
    }
}


export function mostraModaleModifica(idProdotto) {
    const modalHTML = `
        <div class="modal fade" id="modificaProdottoModal" tabindex="-1" aria-labelledby="modificaProdottoModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modificaProdottoModalLabel">Modifica Prodotto</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="modificaProdottoForm">
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
                                <input type="number" class="form-control" id="prezzoInput" min="0">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-dark" data-bs-dismiss="modal">Annulla</button>
                        <button type="button" class="btn btn-dark" id="salvaModificheBtn">Salva</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Inserisci il modale nel documento HTML
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Mostra il modale di modifica
    const modal = new bootstrap.Modal(document.getElementById('modificaProdottoModal'));
    modal.show();

    // Pre-carica i dati del prodotto nel modale
    fetch(`${serverURL}/${idProdotto}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore durante il recupero dei dati del prodotto');
            }
            return response.json();
        })
        .then(data => {
            const prodotto = data.data.attributes;
            document.getElementById('nomeInput').value = prodotto.nome;
            document.getElementById('marcaInput').value = prodotto.marca;
            document.getElementById('prezzoInput').value = prodotto.prezzo;
        })
        .catch(error => console.error(error.message));

    // Aggiungi event listener per il click sul pulsante "Salva"
    const salvaProdottoBtn = document.getElementById('salvaModificheBtn');
    salvaProdottoBtn.addEventListener('click', () => {
        // Recupera i nuovi valori dei campi dal modale
        const nome = document.getElementById('nomeInput').value;
        const marca = document.getElementById('marcaInput').value;
        const prezzo = parseFloat(document.getElementById('prezzoInput').value);

        if (nome && marca) {
            const modifiche = {
                nome: nome,
                marca: marca,
                prezzo: prezzo ? prezzo : null
            };

            inviaModificheProdotto(idProdotto, modifiche);
            modificaRigaTabella(idProdotto, modifiche);
            // Chiudi il modale
            modal.hide();
        } else {
            alert('Per favore, compila tutti i campi obbligatori.');
        }
    });
}

