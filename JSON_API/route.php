<?php

require_once "product.php";


$routes = ['GET' => [], 'POST' => [], 'PUT' => [], 'DELETE' => []];


function addRoute($method, $path, $callback)
{
    global $routes;
    $routes[$method][$path] = $callback;
}


function getRequestMethod()
{
    return $_SERVER['REQUEST_METHOD'];
}


function getRequestPath()
{
    $path = $_SERVER['REQUEST_URI'];
    $path = parse_url($path, PHP_URL_PATH);
    return rtrim($path, '/');
}


function handleRequest()
{
    global $routes;

    $method = getRequestMethod();
    $path = getRequestPath();


    if (isset($routes[$method])) {
        foreach ($routes[$method] as $routePath => $callback) {

            if (preg_match('#^' . $routePath . '$#', $path, $matches)) {
                // Chiamata al callback passando l'ID come parametro
                call_user_func_array($callback, $matches);
                return;
            }
        }
    }

    http_response_code(404);
    echo "404 Not Found";
}


addRoute('GET', '/products/(\d+)', function ($id) {


    $newID = str_split($id, 10);

    $product = Product::Find($newID[1]);
    header("Location: /products/" . $newID[1]);
    header('HTTP/1.1 200 OK');
    header('Content-Type: application/vnd.api+json');
    if ($product) {

        $response =
            [
                'data' =>
                    ['type' => 'products',
                        'id' => $product->getId(),
                        'attributes' =>
                            [
                                'nome' => $product->getName(),
                                'prezzo' => $product->getPrice(),
                                'marca' => $product->getBrand()
                            ]
                    ]
            ];


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
        $data[] = [
            'type' => 'products',
            'id' => $product->getId(),
            'attributes' => [
                'name' => $product->getName(),
                'price' => $product->getPrice(),
                'brand' => $product->getBrand()
            ]
        ];
    }
    header("Location: /products");
    header('HTTP/1.1 200 OK');
    header('Content-Type: application/vnd.api+json');

    $response = ['data' => $data];

    echo json_encode($response, JSON_PRETTY_PRINT);
});
addRoute('POST', '/products', function () {

    $postData = json_decode(file_get_contents('php://input'), true);

    header("Location: /products");
    header('HTTP/1.1 200 OK');
    header('Content-Type: application/vnd.api+json');

    try {
        $newProduct = Product::Create($postData);

        $response = ['data' => [$newProduct]];

        echo json_encode($response, JSON_PRETTY_PRINT);

    } catch (PDOException $e) {
        header("Location: /products");
        header('HTTP/1.1 500 INTERNAL SERVER ERROR');
        header('Content-Type: application/vnd.api+json');
        http_response_code(500);
        echo json_encode(['error' => 'Errore nella creazione del prodotto']);
    }
});


addRoute('PUT', '/products/(\d+)', function ($id) {

    $putData = json_decode(file_get_contents('php://input'), true);
    $newID = str_split($id, 10);
    $product = Product::Find($newID[1]);


    try {
        $updatedProduct = $product->Update($putData);
        var_dump($product);
        if ($updatedProduct) {
            header("Location: /products/(\d+)");
            header('HTTP/1.1 200 OK');
            header('Content-Type: application/vnd.api+json');

            $response = [
                'headers' => [
                    'HTTP/1.1 200 OK',
                    'Content-Type: application/vnd.api+json'],
                'links' => [
                    'self' => "/products/$id",
                    'data' => [$updatedProduct]
                ]
            ];

            echo json_encode($response, JSON_PRETTY_PRINT);
        } else {
            header("Location: /products/(\d+)");
            header('HTTP/1.1 404 NOT FOUND');
            header('Content-Type: application/vnd.api+json');
            http_response_code(404);
            echo json_encode(['error' => 'Prodotto non trovato']);
        }
    } catch (PDOException $e) {
        header("Location: /products/(\d+)");
        header('HTTP/1.1 500 INTERNAL SERVER ERROR');
        header('Content-Type: application/vnd.api+json');
        http_response_code(500);
        echo json_encode(['error' => 'Errore nell\'aggiornamento del prodotto']);
    }
});


addRoute('DELETE', '/products/(\d+)', function ($id) {

    $newID = str_split($id, 10);
    $product = Product::Find($newID[1]);
    if ($product) {
        if ($product->Delete()) {
            header("Location: /products/(\d+)");
            header('HTTP/1.1 204 NO CONTENT');
            header('Content-Type: application/vnd.api+json');

            http_response_code(204);
        } else {
            header("Location: /products/(\d+)");
            header('HTTP/1.1 500 INTERNAL SERVER ERROR');
            header('Content-Type: application/vnd.api+json');
            http_response_code(500);
            echo json_encode(['error' => 'Errore durante l\'eliminazione del prodotto']);
        }
    } else {
        header("Location: /products/(\d+)");
        header('HTTP/1.1 404 NOT FOUND');
        header('Content-Type: application/vnd.api+json');
        http_response_code(404);
        echo json_encode(['error' => 'Prodotto non trovato']);
    }
});

handleRequest();
