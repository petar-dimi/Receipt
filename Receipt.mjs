import fetch from 'node-fetch';

function shortString(string, maxLength) {
  return string.length > maxLength ? `${string.slice(0, maxLength)}...` : string;
}

async function retrieveReceiptFromServer() {
  const url = 'https://interview-task-api.mca.dev/qr-scanner-codes/alpha-qr-gFpwhsQ8fkY1';

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to retrieve receipt details. HTTP status: ${response.status}`);
    const data = await response.json();

    const domesticP = [];
    const importedP = [];

    data.forEach(({ name, price, description, weight, domestic }) => {
      const shortDescription = shortString(description, 10);
      const formattedProduct = {
        name,
        price: `$${price.toFixed(1)}`,
        description: shortDescription,
        weight: weight ? `${weight}g` : 'N/A',
      };
      (domestic ? domesticP : importedP).push(formattedProduct);
    });

    domesticP.sort((a, b) => a.name.localeCompare(b.name));
    importedP.sort((a, b) => a.name.localeCompare(b.name));

    console.log('. Domestic:');
    domesticP.forEach(product => print(product));

    console.log('. Imported:');
    importedP.forEach(product => print(product));

    const domesticCost = domesticP.reduce((total, { price }) => total + parseFloat(price.slice(1)), 0);
    const importedCost = importedP.reduce((total, { price }) => total + parseFloat(price.slice(1)), 0);

    console.log(`Domestic cost: $${domesticCost.toFixed(1)}`);
    console.log(`Imported cost: $${importedCost.toFixed(1)}`);
    console.log(`Domestic count: ${domesticP.length}`);
    console.log(`Imported count: ${importedP.length}`);
  } catch (error) {
    console.log('Failed to retrieve receipt details:', error);
  }
}

function print(product) {
  console.log(`... ${product.name}`);
  console.log(`    Price: ${product.price} Dollars`);
  console.log(`    Description: ${product.description}`);
  console.log(`    Weight: ${product.weight}`);
}

retrieveReceiptFromServer();


// here is the line of code that i used to get the desired output in the terminal ==> node --experimental-modules Receipt.mjs