const url = `https://api.helius.xyz/v0/addresses/${w}/transactions?limit=10&api-key=${token}`;

const parseTransaction = async () => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': '10',
    },
  });

  const data = await response.json();
  console.log("parsed transaction: ", data);
  console.log("parsed transaction length: ", data.length);
};

parseTransaction();