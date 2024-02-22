<?php
require "Dbmanager.php";
class Product
{
    private $id;
    private $name;
    private $price;
    private $brand;


    public function getId()
    {
        return $this->id;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getPrice()
    {
        return $this->price;
    }

    public function setPrice($price)
    {
        $this->price = $price;
    }

    public function getBrand()
    {
        return $this->brand;
    }

    public function setBrand($brand)
    {
        $this->brand = $brand;
    }

    public static function Find($id)
    {
        $pdo = self::Connect();
        $stmt = $pdo->prepare("SELECT * FROM  mantoan_michael_ecommerce.products WHERE id = :id");
        $stmt->bindParam(":id", $id);
        if ($stmt->execute()) {
            return $stmt->fetchObject("product");
        } else {
            return false;
        }
    }

    public static function Create($params)
    {
        $pdo = self::Connect();
        $stmt = $pdo->prepare("INSERT INTO  mantoan_michael_ecommerce.products (name,price,brand) VALUES (:name,:price,:brand)");
        $stmt->bindParam(":name", $params["name"]);
        $stmt->bindParam(":price", $params["price"]);
        $stmt->bindParam(":brand", $params["brand"]);
        if ($stmt->execute()) {
            $stmt = $pdo->prepare("SELECT * FROM  mantoan_michael_ecommerce.products ORDER BY id DESC LIMIT 1");
            $stmt->execute();
            return $stmt->fetchObject("product");
        } else {
            throw new PDOException("Errore Nella Creazione");
        }
    }

    public function Update($params)
    {
        $pdo = self::Connect();
        $stmt = $pdo->prepare("UPDATE  mantoan_michael_ecommerce.products SET name = :name, price = :price, brand = :brand WHERE id = :id");
        $stmt->bindParam(":id",$this->id);
        $stmt->bindParam("name",$params["name"]);
        $stmt->bindParam("price",$params["price"]);
        $stmt->bindParam("brand",$params["brand"]);
        if($stmt->execute())
        {
            $stmt = $pdo->prepare("SELECT * FROM  mantoan_michael_ecommerce.products WHERE id = :id");
            $stmt->bindParam(":id",$this->id);
            $stmt->execute();
            return $stmt->fetchObject("product");
        }
        else
        {
            return false;
        }
    }

    public static function FetchAll()
    {
        $pdo = self::Connect();
        $stmt = $pdo->query("SELECT * FROM  mantoan_michael_ecommerce.products");
        return $stmt->fetchAll(PDO::FETCH_CLASS, 'product');

    }

    public function Delete()
    {
        if(!$this->getId())
        {
            return false;
        }
        $id = $this->getId();
        $pdo = self::Connect();
        $stmt = $pdo->prepare("DELETE FROM  mantoan_michael_ecommerce.products WHERE id = :id");
        $stmt->bindParam(':id',$id,PDO::PARAM_INT);
        $stmt->execute();
        return true;
    }

    public static function Connect()
    {
        return DbManager::Connect("mantoan_michael_ecommerce");
    }


}