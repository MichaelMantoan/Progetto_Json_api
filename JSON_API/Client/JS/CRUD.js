document.addEventListener('DOMContentLoaded', () => {
    // URL del server PHP
    const serverURL = 'http://localhost:8080/api/products';

    // Variabile per memorizzare l'ID del prodotto in modifica/eliminazione
    let prodottoId = null;

    // Funzione per caricare i dati della tabella prodotti
    function caricaDatiTabella() {
        fetch(serverURL)
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector('tbody');
                tbody.innerHTML = ''; // Svuota il corpo della tabella

                data.forEach(prodotto => {
                    const riga = document.createElement('tr');
                    riga.innerHTML = `
                        <td>${prodotto.id}</td>
                        <td>${prodotto.nome}</td>
                        <td>${prodotto.marca}</td>
                        <td>${prodotto.prezzo}</td>
                        <td>
                            <button class="btn btn-primary" onclick="mostraDettagli(${prodotto.id})">Show</button>
                            <button class="btn btn-success" onclick="apriModale('modifica', ${prodotto.id})">Edit</button>
                            <button class="btn btn-danger" onclick="apriModale('elimina', ${prodotto.id})">Delete</button>
                        </td>
                    `;
                    tbody.appendChild(riga);
                });
            })
            .catch(error => console.error('Errore durante il recupero dei dati:', error));
    }

    // Funzione per aprire il modale e configurarlo in base all'operazione CRUD
    function apriModale(operazione, id) {
        prodottoId = id;
        const modal = document.getElementById('modalAggiungiProdotto');
        const modalTitle = document.getElementById('modalTitle');
        const formProdotto = document.getElementById('formProdotto');
        const nomeInput = document.getElementById('nome');
        const marcaInput = document.getElementById('marca');
        const prezzoInput = document.getElementById('prezzo');

        // Impostazione del titolo del modale e del testo del pulsante di salvataggio
        if (operazione === 'modifica') {
            modalTitle.textContent = 'Modifica Prodotto';
            document.getElementById('btnSalva').textContent = 'Salva Modifiche';
            // Recupero dei dati del prodotto da modificare e popolamento del form
            fetch(`${serverURL}/${id}`)
                .then(response => response.json())
                .then(data => {
                    nomeInput.value = data.nome;
                    marcaInput.value = data.marca;
                    prezzoInput.value = data.prezzo;
                })
                .catch(error => console.error('Errore durante il recupero dei dati del prodotto:', error));
        } else if (operazione === 'elimina') {
            modalTitle.textContent = 'Elimina Prodotto';
            document.getElementById('btnSalva').textContent = 'Conferma Eliminazione';
            // Nascondi i campi del form in caso di eliminazione
            formProdotto.style.display = 'none';
        }

        // Visualizza il modale
        $('#modalAggiungiProdotto').modal('show');
    }

    // Funzione per gestire l'evento di conferma eliminazione di un prodotto
    function confermaEliminazione() {
        fetch(`${serverURL}/${prodottoId}`, { method: 'DELETE' })
            .then(() => {
                $('#modalAggiungiProdotto').modal('hide');
                caricaDatiTabella(); // Aggiorna la tabella dopo l'eliminazione
            })
            .catch(error => console.error('Errore durante l\'eliminazione del prodotto:', error));
    }

    // Funzione per gestire l'evento di salvataggio di un prodotto
    function salvaProdotto() {
        const nome = document.getElementById('nome').value;
        const marca = document.getElementById('marca').value;
        const prezzo = document.getElementById('prezzo').value;

        const formData = {
            nome: nome,
            marca: marca,
            prezzo: prezzo
        };

        const method = prodottoId ? 'PUT' : 'POST';
        const url = prodottoId ? `${serverURL}/${prodottoId}` : serverURL;

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(() => {
                $('#modalAggiungiProdotto').modal('hide');
                caricaDatiTabella(); // Aggiorna la tabella dopo il salvataggio
            })
            .catch(error => console.error('Errore durante il salvataggio del prodotto:', error));
    }

    // Chiamata iniziale per caricare i dati della tabella all'avvio della pagina
    caricaDatiTabella();
});
