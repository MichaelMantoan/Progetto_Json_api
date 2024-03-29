import { mostraDettagli } from "./get.js";

const serverURL = 'http://127.0.0.1:8081/products';

export function caricaDatiTabella() {
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

            data.data.forEach(function (prodotto) {
                console.log(prodotto);
                const riga = document.createElement('tr');
                riga.innerHTML = `
                        <td>${prodotto.id}</td>
                        <td>${prodotto.attributes.nome}</td>
                        <td>${prodotto.attributes.marca}</td>
                        <td>${prodotto.attributes.prezzo}</td>
                        <td>
                            <button class="btn btn-primary show-btn" data-id="${prodotto.id}">Show</button>
                            <button class="btn btn-success edit-btn">Edit</button>
                            <button class="btn btn-danger delete-btn">Delete</button>
                        </td>
                    `;
                tbody.appendChild(riga);

                // Aggiungi gestori di eventi per i pulsanti appena creati
                riga.querySelector('.show-btn').addEventListener('click', () => {
                    mostraDettagli(prodotto.id);
                });

                // Aggiungi altri gestori di eventi per gli altri pulsanti, se necessario
            });
        })
        .catch(error => console.error(error.message));
}

// Chiamata iniziale per caricare i dati della tabella all'avvio della pagina
document.addEventListener('DOMContentLoaded', caricaDatiTabella);
