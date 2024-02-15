<?php
require '../models/product.php';
// Definisci un array associativo per mappare le route
$routes = ['GET' => [], 'POST' => [], 'PUT' => [], 'DELETE' => []];

// Funzione per aggiungere una route
function addRoute($method, $path, $callback) {
    global $routes;
    $routes[$method][$path] = $callback;
}

// Funzione per ottenere il metodo della richiesta HTTP
function getRequestMethod() {
    return $_SERVER['REQUEST_METHOD'];
}

// Funzione per ottenere il percorso richiesto
function getRequestPath() {
    $path = $_SERVER['REQUEST_URI'];
    $path = parse_url($path, PHP_URL_PATH);
    return rtrim($path, '/');
}

// Funzione per gestire la richiesta
function handleRequest() {
    global $routes;

    $method = getRequestMethod();
    $path = getRequestPath();

    // Verifica se esiste una route per il metodo e il percorso richiesti
    if (isset($routes[$method])) {
        foreach ($routes[$method] as $routePath => $callback) {
            // Verifica se il percorso richiesto corrisponde al percorso della route
            if (preg_match('#^' . $routePath . '$#', $path, $matches)) {
                // Chiamata al callback passando l'ID come parametro
                call_user_func_array($callback, $matches);
                return;
            }
        }
    }

    // Ritorna un errore 404 se la route non è stata trovata
    http_response_code(404);
    echo "404 Not Found";
}

// Aggiungi le tue route qui
addRoute('GET', '/products/(\d+)', function($id) {
    // Trova il prodotto dal database utilizzando il metodo statico Find della classe Product
    $product = Product::Find($id);

    if($product) {
        // Costruisci la risposta JSON conforme alla JSON API
        $response = [
            'links' => [
                'self' => "/products/$id",
                'data' => [$product]
            ]
        ];

        // Imposta gli header per indicare che la risposta è JSON
        header('Content-Type: application/json');

        // Restituisci la risposta JSON
        echo json_encode($response);
    } else {
        // Ritorna un errore 404 se il prodotto non è stato trovato
        http_response_code(404);
        echo json_encode(['error' => 'Prodotto non trovato']);
    }
});

addRoute('GET', '/products', function() {
    // Recupera tutti i prodotti dal database utilizzando il metodo statico FetchAll della classe Product
    $products = Product::FetchAll();

    // Costruisci la risposta JSON conforme alla JSON API
    $data = [];
    foreach ($products as $product) {
        $data[] = [
            'type' => 'products',
            'id' => $product->getId(),
            'attributes' => [
                'nome' => $product->getName(),
                'prezzo' => $product->getPrice(),
                'marca' => $product->getBrand()
            ]
        ];
    }

    $response = [
        'links' => [
            'self' => '/products',
            'data' => $data
        ]
    ];

    // Imposta gli header per indicare che la risposta è JSON
    header('Content-Type: application/json');

    // Restituisci la risposta JSON
    echo json_encode($response);
});


// Esegui il gestore della richiesta
handleRequest();
