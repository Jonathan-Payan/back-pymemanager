const app = require('../app');
const { test } = require('@jest/globals');
const pool = require('../config/db');

const { getProducts } = require('../services/products.service');

describe('getProducts', () => {
  it('returns an empty array if no products match the query', async () => {
    // Arrange
    const params = { code: 'invalid_code' };

    // Act
    const result = await getProducts(params);

    // Assert
    expect(result).toEqual([]);
  });

  it('returns products that match the query', async () => {
    // Arrange
    const params = { code: '0001' };
    const expected = [{
      "code": "0001",
      "name": "Arroz",
      "idCategory": 1,
      "categoryName": "Alimentos secos",
      "weight": 1000,
      "quantity": 50,
      "purchasePrice": 2000,
      "salePrice": 2500,
      "entryDate": "2023-05-01",
      "expirationDate": "2024-05-01",
      "description": "Arroz blanco"
    }];

    // Act
    const result = await getProducts(params);

    // Assert
    expect(result).toEqual(expected);
  });

  it('returns products that match the date range', async () => {
    // Arrange
    const params = { entryDateStart: '2023-05-01', entryDateEnd: '2023-05-02' };
    const expected = [  {
      "code": "0001",
      "name": "Arroz",
      "idCategory": 1,
      "categoryName": "Alimentos secos",
      "weight": 1000,
      "quantity": 50,
      "purchasePrice": 2000,
      "salePrice": 2500,
      "entryDate": "2023-05-01",
      "expirationDate": "2024-05-01",
      "description": "Arroz blanco"
    },
    {
      "code": "0002",
      "name": "Leche",
      "idCategory": 9,
      "categoryName": "Alimentos refrigerados",
      "weight": 1000,
      "quantity": 20,
      "purchasePrice": 2000,
      "salePrice": 2500,
      "entryDate": "2023-05-02",
      "expirationDate": "2023-05-12",
      "description": "Leche entera"
    },
    {
      "code": "0003",
      "name": "Jabón de baño",
      "idCategory": 4,
      "categoryName": "Cuidado personal",
      "weight": 500,
      "quantity": 40,
      "purchasePrice": 1000,
      "salePrice": 1500,
      "entryDate": "2023-05-02",
      "expirationDate": "2024-05-02",
      "description": "Jabón en barra"
    }];

    // Act
    const result = await getProducts(params);

    // Assert
    expect(result).toEqual(expected);
 });

  it('returns products that match the category ID', async () => {
    // Arrange
    const params = { idCategory: 1 };
    const expected = [{
      "code": "0001",
      "name": "Arroz",
      "idCategory": 1,
      "categoryName": "Alimentos secos",
      "weight": 1000,
      "quantity": 50,
      "purchasePrice": 2000,
      "salePrice": 2500,
      "entryDate": "2023-05-01",
      "expirationDate": "2024-05-01",
      "description": "Arroz blanco"
    },
    {
      "code": "0011",
      "name": "Aceite",
      "idCategory": 1,
      "categoryName": "Alimentos secos",
      "weight": 1000,
      "quantity": 50,
      "purchasePrice": 3000,
      "salePrice": 3500,
      "entryDate": "2022-05-01",
      "expirationDate": "2024-05-01",
      "description": "Aceite vegetal"
    }];

    // Act
    const result = await getProducts(params);

    // Assert
    expect(result).toEqual(expected);
 });

 it('returns products that match the name', async () => {
    // Arrange
    const params = { name: 'Cerveza' };
    const expected = [{
      "code": "0006",
      "name": "Cerveza",
      "idCategory": 3,
      "categoryName": "Bebidas alcohólicas",
      "weight": 1000,
      "quantity": 10,
      "purchasePrice": 3000,
      "salePrice": 3500,
      "entryDate": "2023-05-05",
      "expirationDate": "2023-07-05",
      "description": "Cerveza Rubia"
    }];

    // Act
    const result = await getProducts(params);

    // Assert
    expect(result).toEqual(expected);
 });

 it('returns products that match multiple parameters', async () => {
  // Arrange
  const params = { idCategory: 1, weight: 1000 };
  const expected = [  {
    "code": "0001",
    "name": "Arroz",
    "idCategory": 1,
    "categoryName": "Alimentos secos",
    "weight": 1000,
    "quantity": 50,
    "purchasePrice": 2000,
    "salePrice": 2500,
    "entryDate": "2023-05-01",
    "expirationDate": "2024-05-01",
    "description": "Arroz blanco"
  },
  {
    "code": "0011",
    "name": "Aceite",
    "idCategory": 1,
    "categoryName": "Alimentos secos",
    "weight": 1000,
    "quantity": 50,
    "purchasePrice": 3000,
    "salePrice": 3500,
    "entryDate": "2022-05-01",
    "expirationDate": "2024-05-01",
    "description": "Aceite vegetal"
  }];

  // Act
  const result = await getProducts(params);

  // Assert
  expect(result).toEqual(expected);
});


  it('returns all products when all parameters are null', async () => {
    // Arrange
    const params = {
      code: null,
      name: null,
      idCategory: null,
      weight: null,
      quantity: null,
      entryDateStart: null,
      entryDateEnd: null,
      expirationDate: null,
      description: null,
      salePrice: null,
      purchasePrice: null,
    };
    const expected = [
      {
        "code": "0001",
        "name": "Arroz",
        "idCategory": 1,
        "categoryName": "Alimentos secos",
        "weight": 1000,
        "quantity": 50,
        "purchasePrice": 2000,
        "salePrice": 2500,
        "entryDate": "2023-05-01",
        "expirationDate": "2024-05-01",
        "description": "Arroz blanco"
      },
      {
        "code": "0011",
        "name": "Aceite",
        "idCategory": 1,
        "categoryName": "Alimentos secos",
        "weight": 1000,
        "quantity": 50,
        "purchasePrice": 3000,
        "salePrice": 3500,
        "entryDate": "2022-05-01",
        "expirationDate": "2024-05-01",
        "description": "Aceite vegetal"
      },
      {
        "code": "0007",
        "name": "Jugo de naranja",
        "idCategory": 2,
        "categoryName": "Bebidas no alcohólicas",
        "weight": 1000,
        "quantity": 15,
        "purchasePrice": 2500,
        "salePrice": 3000,
        "entryDate": "2023-05-06",
        "expirationDate": "2023-06-06",
        "description": "Jugo natural"
      },
      {
        "code": "0012",
        "name": "Coca-Cola",
        "idCategory": 2,
        "categoryName": "Bebidas no alcohólicas",
        "weight": 1000,
        "quantity": 20,
        "purchasePrice": 2000,
        "salePrice": 2500,
        "entryDate": "2022-05-02",
        "expirationDate": "2023-05-12",
        "description": "Refresco de cola"
      },
      {
        "code": "0017",
        "name": "Jugo de piña",
        "idCategory": 2,
        "categoryName": "Bebidas no alcohólicas",
        "weight": 1000,
        "quantity": 15,
        "purchasePrice": 2500,
        "salePrice": 3000,
        "entryDate": "2022-05-06",
        "expirationDate": "2023-06-06",
        "description": "Jugo natural de piña"
      },
      {
        "code": "0006",
        "name": "Cerveza",
        "idCategory": 3,
        "categoryName": "Bebidas alcohólicas",
        "weight": 1000,
        "quantity": 10,
        "purchasePrice": 3000,
        "salePrice": 3500,
        "entryDate": "2023-05-05",
        "expirationDate": "2023-07-05",
        "description": "Cerveza Rubia"
      },
      {
        "code": "0016",
        "name": "Ron Medellín Añejo",
        "idCategory": 3,
        "categoryName": "Bebidas alcohólicas",
        "weight": 1000,
        "quantity": 10,
        "purchasePrice": 40000,
        "salePrice": 45000,
        "entryDate": "2022-05-05",
        "expirationDate": "2023-07-05",
        "description": "Ron añejo de Medellín"
      },
      {
        "code": "0003",
        "name": "Jabón de baño",
        "idCategory": 4,
        "categoryName": "Cuidado personal",
        "weight": 500,
        "quantity": 40,
        "purchasePrice": 1000,
        "salePrice": 1500,
        "entryDate": "2023-05-02",
        "expirationDate": "2024-05-02",
        "description": "Jabón en barra"
      },
      {
        "code": "0010",
        "name": "Crema dental",
        "idCategory": 4,
        "categoryName": "Cuidado personal",
        "weight": 100,
        "quantity": 40,
        "purchasePrice": 2000,
        "salePrice": 2500,
        "entryDate": "2023-05-09",
        "expirationDate": "2024-05-09",
        "description": "Crema dental blanqueadora"
      },
      {
        "code": "0013",
        "name": "Shampoo",
        "idCategory": 4,
        "categoryName": "Cuidado personal",
        "weight": 500,
        "quantity": 40,
        "purchasePrice": 1000,
        "salePrice": 1500,
        "entryDate": "2022-05-02",
        "expirationDate": "2024-05-02",
        "description": "Shampoo para cabello normal"
      },
      {
        "code": "0020",
        "name": "Enjuague bucal Listerine Cool Mint",
        "idCategory": 4,
        "categoryName": "Cuidado personal",
        "weight": 100,
        "quantity": 40,
        "purchasePrice": 3000,
        "salePrice": 3500,
        "entryDate": "2022-05-09",
        "expirationDate": "2024-05-09",
        "description": "Enjuague bucal con sabor a menta fresca."
      },
      {
        "code": "4005800137655",
        "name": "crema nivea",
        "idCategory": 4,
        "categoryName": "Cuidado personal",
        "weight": 40,
        "quantity": 100,
        "purchasePrice": 7000,
        "salePrice": 7800,
        "entryDate": "2023-05-11",
        "expirationDate": "2024-03-05",
        "description": "cuidado de la piel"
      },
      {
        "code": "0004",
        "name": "Manzanas",
        "idCategory": 5,
        "categoryName": "Frutas y verduras",
        "weight": 200,
        "quantity": 30,
        "purchasePrice": 2500,
        "salePrice": 3500,
        "entryDate": "2023-05-03",
        "expirationDate": "2023-05-10",
        "description": "Manzanas rojas"
      },
      {
        "code": "0014",
        "name": "Papaya",
        "idCategory": 5,
        "categoryName": "Frutas y verduras",
        "weight": 200,
        "quantity": 30,
        "purchasePrice": 3500,
        "salePrice": 4500,
        "entryDate": "2022-05-03",
        "expirationDate": "2023-05-10",
        "description": "Papaya fresca"
      },
      {
        "code": "0009",
        "name": "Pan de molde",
        "idCategory": 6,
        "categoryName": "Panadería y pastelería",
        "weight": 500,
        "quantity": 30,
        "purchasePrice": 2500,
        "salePrice": 3000,
        "entryDate": "2023-05-08",
        "expirationDate": "2023-05-15",
        "description": "Pan blanco"
      },
      {
        "code": "0019",
        "name": "Pan integral",
        "idCategory": 6,
        "categoryName": "Panadería y pastelería",
        "weight": 500,
        "quantity": 30,
        "purchasePrice": 3000,
        "salePrice": 3500,
        "entryDate": "2022-05-08",
        "expirationDate": "2023-05-15",
        "description": "Pan integral con semillas de girasol y linaza"
      },
      {
        "code": "0008",
        "name": "Jabón en polvo",
        "idCategory": 7,
        "categoryName": "Productos de limpieza",
        "weight": 1000,
        "quantity": 25,
        "purchasePrice": 4000,
        "salePrice": 5000,
        "entryDate": "2023-05-07",
        "expirationDate": "2024-05-07",
        "description": "Detergente para ropa"
      },
      {
        "code": "0018",
        "name": "Detergente en polvo",
        "idCategory": 7,
        "categoryName": "Productos de limpieza",
        "weight": 1000,
        "quantity": 25,
        "purchasePrice": 4000,
        "salePrice": 5000,
        "entryDate": "2022-05-07",
        "expirationDate": "2024-05-07",
        "description": "Detergente para Ropa"
      },
      {
        "code": "1123232838773",
        "name": "crema detal Colgate total 12",
        "idCategory": 7,
        "categoryName": "Productos de limpieza",
        "weight": 75,
        "quantity": 50,
        "purchasePrice": 11000,
        "salePrice": 14500,
        "entryDate": "2023-05-11",
        "expirationDate": "2024-07-07",
        "description": "producto de importación "
      },
      {
        "code": "0005",
        "name": "Galletas",
        "idCategory": 8,
        "categoryName": "Snacks y golosinas",
        "weight": 250,
        "quantity": 60,
        "purchasePrice": 2000,
        "salePrice": 2500,
        "entryDate": "2023-05-04",
        "expirationDate": "2023-11-04",
        "description": "Galletas de chocolate"
      },
      {
        "code": "0015",
        "name": "Chocolatina Jet",
        "idCategory": 8,
        "categoryName": "Snacks y golosinas",
        "weight": 250,
        "quantity": 60,
        "purchasePrice": 1000,
        "salePrice": 1500,
        "entryDate": "2022-05-04",
        "expirationDate": "2023-11-04",
        "description": "Chocolatina de chocolate con leche y avellanas"
      },
      {
        "code": "0002",
        "name": "Leche",
        "idCategory": 9,
        "categoryName": "Alimentos refrigerados",
        "weight": 1000,
        "quantity": 20,
        "purchasePrice": 2000,
        "salePrice": 2500,
        "entryDate": "2023-05-02",
        "expirationDate": "2023-05-12",
        "description": "Leche entera"
      }
    ];

    // Act
    const result = await getProducts(params);

    // Assert
    expect(result).toEqual(expected);
  });
});
