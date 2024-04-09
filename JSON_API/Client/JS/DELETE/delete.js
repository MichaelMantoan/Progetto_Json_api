import { caricaDatiTabella } from "../GET/getall.js";

const serverURL = 'http://127.0.0.1:8081/products';

export function eliminaProdotto(idProdotto) {
    const requestOptions = {
        method: 'DELETE'
    };

    fetch(`${serverURL}/${idProdotto}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore durante l\'eliminazione del prodotto');
            }


        })
        .catch(error => console.error(error.message));
}

// Funzione per confermare l'eliminazione di un prodotto
export function confermaEliminazione(idProdotto) {
    if (confirm('Sei sicuro di voler eliminare questo prodotto?')) {
        eliminaProdotto(idProdotto);
        document.getElementById(`row-${idProdotto}`).remove();
    }
}
