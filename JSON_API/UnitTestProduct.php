<?php
require_once "Product.php"; // Assicurati di includere la classe Product

use PHPUnit\Framework\TestCase;

class ProductTest extends TestCase
{
    public function testFind()
    {
        $product = Product::Find(1);
        $this->assertInstanceOf(Product::class, $product);
        // Assicurati che il prodotto recuperato abbia lo stesso ID di quello cercato
        $this->assertEquals(1, $product->getId());
    }

    public function testCreate()
    {
        $params = array(
            "nome" => "Test Product",
            "marca" => "Test Brand",
            "prezzo" => 99.99
        );

        $product = Product::Create($params);
        $this->assertInstanceOf(Product::class, $product);
        // Assicurati che il prodotto creato abbia lo stesso nome passato come parametro
        $this->assertEquals($params['nome'], $product->getNome());
    }

    public function testUpdate()
    {
        $product = Product::Find(1);
        $params = array(
            "nome" => "Updated Name",
            "marca" => "Updated Brand",
            "prezzo" => 49.99
        );

        $updatedProduct = $product->Update($params);
        $this->assertInstanceOf(Product::class, $updatedProduct);
        // Assicurati che il prodotto aggiornato abbia lo stesso ID del prodotto originale
        $this->assertEquals($product->getId(), $updatedProduct->getId());
        // Assicurati che il nome sia stato aggiornato correttamente
        $this->assertEquals($params['nome'], $updatedProduct->getNome());
    }

    public function testFetchAll()
    {
        $products = Product::FetchAll();
        $this->assertIsArray($products);
        // Assicurati che almeno un prodotto sia presente
        $this->assertNotEmpty($products);
        // Assicurati che ogni elemento nell'array sia un'istanza della classe Product
        foreach ($products as $product) {
            $this->assertInstanceOf(Product::class, $product);
        }
    }

    public function testDelete()
    {
        $product = Product::Find(1);
        $result = $product->Delete();
        $this->assertTrue($result);
        // Assicurati che il prodotto sia stato eliminato
        $deletedProduct = Product::Find(1);
        $this->assertFalse($deletedProduct);
    }
}
?>
