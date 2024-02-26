require 'json'
require "faraday"

response = Faraday.get("http://127.0.0.1:8081/products")
raise "Test fallito" unless response.status == 200

gotten = JSON.parse(response.body)
raise "Test fallito" unless gotten.has_key?("data")
raise "Test fallito" unless gotten["data"].is_a? Array
raise "Test fallito" unless gotten["data"][0].has_key?("type")
raise "Test fallito" unless gotten["data"][0].has_key?("id")
raise "Test fallito" unless gotten["data"][0].has_key?("attributes")
raise "Test fallito" unless gotten["data"][0]["attributes"].has_key?("nome")
raise "Test fallito" unless gotten["data"][0]["attributes"].has_key?("marca")
raise "Test fallito" unless gotten["data"][0]["attributes"].has_key?("prezzo")

body = '{"data": {"nome": "test_prodotto", "marca": "Marca1", "prezzo": 19}}'
response = Faraday.post("http://127.0.0.1:8081/products", body)
raise "Test fallito" unless response.status == 201

gotten = JSON.parse(response.body)
raise "Test fallito" unless gotten.has_key?("data")
raise "Test fallito" unless gotten["data"].has_key?("type")
raise "Test fallito" unless gotten["data"].has_key?("id")
raise "Test fallito" unless gotten["data"].has_key?("attributes")
raise "Test fallito" unless gotten["data"]["attributes"].has_key?("nome")
raise "Test fallito" unless gotten["data"]["attributes"].has_key?("marca")
raise "Test fallito" unless gotten["data"]["attributes"].has_key?("prezzo")

test_id = gotten["data"]["id"]
response = Faraday.get("http://127.0.0.1:8081/products/#{test_id}")
raise "Test fallito" unless response.status == 200

gotten = JSON.parse(response.body)
raise "Test fallito" unless gotten.has_key?("data")
raise "Test fallito" unless gotten["data"].is_a? Array
raise "Test fallito" unless gotten["data"].has_key?("type")
raise "Test fallito" unless gotten["data"].has_key?("id")
raise "Test fallito" unless gotten["data"].has_key?("attributes")
raise "Test fallito" unless gotten["data"]["attributes"].has_key?("nome")
raise "Test fallito" unless gotten["data"]["attributes"].has_key?("marca")
raise "Test fallito" unless gotten["data"]["attributes"].has_key?("prezzo")

["nome", "marca"].each do |key|
  # body = "{\"data\": {\"#{key}\": \"test\"}}"
  body = {}
  body["data"] = {}
  body["data"][key] = "test"
  response = Faraday.patch("http://127.0.0.1:8081/products/#{test_id}", JSON.generate(body))
  raise "Test fallito" unless response.status == 200
  
  gotten = JSON.parse(response.body)
  raise "Test fallito" unless gotten.has_key?("data")
  raise "Test fallito" unless gotten["data"].has_key?("type")
  raise "Test fallito" unless gotten["data"].has_key?("id")
  raise "Test fallito" unless gotten["data"].has_key?("attributes")
  raise "Test fallito" unless gotten["data"]["attributes"].has_key?("nome")
  raise "Test fallito" unless gotten["data"]["attributes"].has_key?("marca")
  raise "Test fallito" unless gotten["data"]["attributes"].has_key?("prezzo")
  raise "Test fallito" if gotten["data"]["attributes"][key] != "test"
end

body = {}
body["data"] = {}
body["data"]["prezzo"] = 64
response = Faraday.patch("http://127.0.0.1:8081/products/#{test_id}", JSON.generate(body))
raise "Test fallito" unless response.status == 200

gotten = JSON.parse(response.body)
raise "Test fallito" unless gotten.has_key?("data")
raise "Test fallito" unless gotten["data"].has_key?("type")
raise "Test fallito" unless gotten["data"].has_key?("id")
raise "Test fallito" unless gotten["data"].has_key?("attributes")
raise "Test fallito" unless gotten["data"]["attributes"].has_key?("nome")
raise "Test fallito" unless gotten["data"]["attributes"].has_key?("marca")
raise "Test fallito" unless gotten["data"]["attributes"].has_key?("prezzo")
raise "Test fallito" if gotten["data"]["attributes"]["prezzo"] != 64
  
  
response = Faraday.delete("http://127.0.0.1:8081/products/#{test_id}")
raise "Test fallito" unless response.status == 204

response = Faraday.delete("http://127.0.0.1:8081/products/#{test_id}")
raise "Test fallito" unless response.status == 404