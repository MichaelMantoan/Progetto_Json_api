<?php
// Includi il file contenente la definizione della classe Product
require_once "product.php";
 $clientURL = $_SERVER['HTTP_ORIGIN'];
// Verifica se l'origine della richiesta corrisponde all'URL del tuo client
if (isset($_SERVER['HTTP_ORIGIN'])) {
    // Abilita CORS solo per l'URL del tuo client
    header("Access-Control-Allow-Origin: $clientURL");
    header("Access-Control-Allow-Headers: Content-Type:application/vnd.api+json");
    header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE");
}

// Definizione delle rotte per i diversi metodi HTTP
$routes = ['GET' => [], 'POST' => [], 'PATCH' => [], 'DELETE' => []];

// Funzione per aggiungere una nuova route
function addRoute($method, $path, $callback)
{
    global $routes;
    $routes[$method][$path] = $callback;
}

// Ottieni il metodo della richiesta HTTP
function getRequestMethod()
{
    return $_SERVER['REQUEST_METHOD'];
}

// Ottieni il percorso della richiesta
function getRequestPath()
{
    $path = $_SERVER['REQUEST_URI'];
    $path = parse_url($path, PHP_URL_PATH);
    return rtrim($path, '/');
}

// Gestisci la richiesta in base alle rotte definite
function handleRequest()
{
    global $routes;

    $method = getRequestMethod();
    $path = getRequestPath();

    // Controlla se esiste una route per il metodo e il percorso specificati
    if (isset($routes[$method])) {
        foreach ($routes[$method] as $routePath => $callback) {
            if (preg_match('#^' . $routePath . '$#', $path, $matches)) {
                // Chiama la funzione di callback associata alla route
                call_user_func_array($callback, $matches);
                return;
            }
        }
    }

    // Se non viene trovata una corrispondenza, restituisci un errore 404
    http_response_code(404);
    echo "404 Not Found";
}

// Aggiungi una route per gestire le richieste di preflight OPTIONS
addRoute('OPTIONS', '/products', function () {
    // Invia le intestazioni CORS appropriate
    global $clientURL;
    header("Access-Control-Allow-Origin: $clientURL");
    header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
    header("Access-Control-Allow-Methods:  GET,POST");
    header("Content-Length: 0");
    http_response_code(200);
    exit();
});
addRoute('OPTIONS', '/products/(\d+)', function () {
    // Invia le intestazioni CORS appropriate
    global $clientURL;
    header("Access-Control-Allow-Origin: $clientURL");
    header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
    header("Access-Control-Allow-Methods: GET, PATCH, DELETE");
    header("Content-Length: 0");
    http_response_code(200);
    exit();
});


addRoute('GET', '/products/(\d+)', function ($matches) {
    $parts = explode('/', $matches);
    $id = end($parts);
    $product = Product::Find($id);
    header("Location: /products/" . $id);
    http_response_code(200);
    header('Content-Type: application/vnd.api+json');
    if ($product) {
        $data =
            [
                'type' => 'products',
                'id' => $product->getId(),
                'attributes' =>
                    [
                        'nome' => $product->getNome(),
                        'marca' => $product->getMarca(),
                        'prezzo' => $product->getPrezzo()
                    ]
            ];
        $response = ['data' => $data];
        echo json_encode($response, JSON_PRETTY_PRINT);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Prodotto non trovato']);
    }
});

addRoute('GET', '/products', function () {
    $products = Product::FetchAll();
    $data = [];
    foreach ($products as $product) {
        $data[] =
            [
                'type' => 'products',
                'id' => $product->getId(),
                'attributes' =>
                    [
                        'nome' => $product->getNome(),
                        'marca' => $product->getMarca(),
                        'prezzo' => $product->getPrezzo()
                    ]
            ];
    }

    header("Location: /products");
    http_response_code(200);
    header('Content-Type: application/vnd.api+json');
    $response = ['data' => $data];
    echo json_encode($response, JSON_PRETTY_PRINT);
});

addRoute('POST', '/products', function () {

    $data = [];
    if (isset($_POST['data']))
        $postData = $_POST;
    else
        $postData = json_decode(file_get_contents("php://input"), true);
    try {
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($postData['data']['attributes']['marca'], $postData['data']['attributes']['nome'], $postData['data']['attributes']['prezzo'])) {
            $newProduct = Product::Create($postData["data"]["attributes"]);
            $data =
                [
                    'type' => 'products',
                    'id' => $newProduct->getId(),
                    'attributes' =>
                        [
                            'nome' => $newProduct->getNome(),
                            'marca' => $newProduct->getMarca(),
                            'prezzo' => $newProduct->getPrezzo()
                        ]
                ];

            $response = ['data' => $data];
            echo json_encode($response, JSON_PRETTY_PRINT);
            header("Location: /products");
            http_response_code(201);
            header('Content-Type: application/vnd.api+json');
        }
    } catch (PDOException $e) {
        header("Location: /products");
        header('Content-Type: application/vnd.api+json');
        http_response_code(500);
        echo json_encode(['error' => 'Errore nella creazione del prodotto']);
    }
});

addRoute('PATCH', '/products/(\d+)', function ($matches) {


    $parts = explode('/', $matches);
    $id = end($parts);
    $patchData = json_decode(file_get_contents("php://input"), true);
    $product = Product::Find($id);

    try {
        if ($patchData && $product) {
            $updatedProduct = $product->Update($patchData["data"]["attributes"]);
            $data = [
                'type' => 'products',
                'id' => $updatedProduct->getId(),
                'attributes' => [
                    'nome' => $updatedProduct->getNome(),
                    'marca' => $updatedProduct->getMarca(),
                    'prezzo' => $updatedProduct->getPrezzo()
                ]
            ];

            $response = ['data' => $data];

            header("Location: /products/" . $id);
            http_response_code(200);
            header('Content-Type: application/vnd.api+json');
            echo json_encode($response, JSON_PRETTY_PRINT);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Prodotto non trovato']);
        }
    } catch (PDOException $e) {
        header("Location: /products/" . $id);
        header('Content-Type: application/vnd.api+json');
        http_response_code(500);
        echo json_encode(['error' => 'Errore nell aggiornamento del prodotto']);
    }
});



addRoute('DELETE', '/products/(\d+)', function ($id) {
    $newID = str_split($id, 10);
    $product = Product::Find($newID[1]);
    if ($product) {
        if ($product->Delete()) {
            http_response_code(204);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Errore durante l\'eliminazione del prodotto']);
        }
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Prodotto non trovato']);
    }
});

handleRequest();
