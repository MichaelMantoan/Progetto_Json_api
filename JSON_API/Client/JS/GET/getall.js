document.addEventListener('DOMContentLoaded', () => {
    // URL del server PHP
    const serverURL = 'http://127.0.0.1:8081/products';

    // Funzione per caricare i dati della tabella prodotti
    function caricaDatiTabella() {
        fetch(serverURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Errore durante il recupero dei dati');
                }
                return response.json();
            })
            .then(data => {
                console.log(typeof (data));
                const tbody = document.querySelector('tbody');
                tbody.innerHTML = ''; // Svuota il corpo della tabella

                const dataArray = Object.values(data);

                data.data.forEach(function(prodotto) {
                    console.log(prodotto);
                    const riga = document.createElement('tr');
                    riga.innerHTML = `
                        <td>${prodotto.id}</td>
                        <td>${prodotto.attributes.nome}</td>
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
        //.catch(error => console.error(error.message));
    }

    // Chiamata iniziale per caricare i dati della tabella all'avvio della pagina
    caricaDatiTabella();
});

